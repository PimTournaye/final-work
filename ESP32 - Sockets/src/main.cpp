#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>

#include <ArduinoJson.h>

#include <Adafruit_NeoPixel.h>

#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>

WiFiMulti WiFiMulti;
SocketIOclient socketIO;

// Network configuration
const char *ssid = "REPLACE_WITH_YOUR_SSID";
const char *password = "REPLACE_WITH_YOUR_PASSWORD";
const char *host = "INSERT HERE HOST ADDRESS";

// Control panel pins
int masterSliderPin = 26;  // A0
int piano1Pin = 25;        // A1
int piano2Pin = 34;        // A2
int othersPin = 39;        // A3
int speedPin = 36;         // A4
int pixelRing = 15;        // D15
int rotaryPinA = 32;       // D32
int rotaryPinB = 14;       // D14

int rotaryCounter = 0;
int rotaryAState;
int rotaryALastState;

int getSpeed() {
  float analogValue = analogRead(speedPin);
  return map(analogValue, 0, 1023, 0, 100);
}

// Function to read the rotary encoder
void rotaryRead() {
  rotaryAState = digitalRead(rotaryPinA);
  if (rotaryAState != rotaryALastState) {
    if (digitalRead(rotaryPinB) != rotaryALastState) {
      rotaryCounter++;
    } else {
      rotaryCounter--;
    }
  }
  rotaryALastState = rotaryAState;
}

// String makeJson() {

//   String output;

//   doc["masterVolume"] = analogRead(masterSliderPin);
//   doc["piano1"] = analogRead(piano1Pin);
//   doc["piano2"] = analogRead(piano2Pin);
//   doc["other"] = analogRead(othersPin);
//   doc["speed"] = getSpeed();
//   doc["circle"] = rotaryCounter % 12;

//   serializeJson(doc, output);

//   return output;
// }


void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length) {

  switch (type) {
    case sIOtype_DISCONNECT:
      Serial.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      Serial.printf("[IOc] Connected to url: %s\n", payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:{
        char *sptr = NULL;
        int id = strtol((char *)payload, &sptr, 10);
        Serial.printf("[IOc] get event: %s id: %d\n", payload, id);
        if (id) {
          payload = (uint8_t *)sptr;
        }
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, payload, length);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return;
        }

        String eventName = doc[0];
        Serial.printf("[IOc] event name: %s\n", eventName.c_str());

        // Message Includes a ID for a ACK (callback)
        if (id) {
          // creat JSON message for Socket.IO (ack)
          DynamicJsonDocument docOut(1024);
          JsonArray array = docOut.to<JsonArray>();

          // add payload (parameters) for the ack (callback function)
          JsonObject param1 = array.createNestedObject();
          param1["now"] = millis();

          // JSON to String (serializion)
          String output;
          output += id;
          serializeJson(docOut, output);

          // Send event
          socketIO.send(sIOtype_ACK, output);
        }
      }
      break;
    case sIOtype_ACK:
      Serial.printf("[IOc] get ack: %u\n", length);
      break;
    case sIOtype_ERROR:
      Serial.printf("[IOc] get error: %u\n", length);
      break;
    case sIOtype_BINARY_EVENT:
      Serial.printf("[IOc] get binary: %u\n", length);
      break;
    case sIOtype_BINARY_ACK:
      Serial.printf("[IOc] get binary ack: %u\n", length);
      break;
  }
}

////////////////////
// MAIN FUNCTIONS //
////////////////////
void setup() {
  Serial.begin(9600);

  Serial.println("Booting...");
  Serial.println("");
  Serial.println("");

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Log the ESP32 local IP Address
  Serial.println(WiFi.localIP());

  // Set up pins
  pinMode(masterSliderPin, INPUT);
  pinMode(speedPin, INPUT);
  pinMode(piano1Pin, INPUT);
  pinMode(piano2Pin, INPUT);
  pinMode(othersPin, INPUT);

  pinMode(pixelRing, OUTPUT);

  pinMode(rotaryPinA, INPUT);
  pinMode(rotaryPinB, INPUT);

  rotaryALastState = digitalRead(rotaryPinA);

  // server address, port and URL
  socketIO.begin("10.11.100.100", 8880, "/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);
}

unsigned long messageTimestamp = 0;
void loop() {
  socketIO.loop();

  uint64_t now = millis();

  if (now - messageTimestamp > 2000) {
    messageTimestamp = now;

    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add evnet name
    // Hint: socket.on('event_name', ....
    array.add("arduino_event");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["masterVolume"] = analogRead(masterSliderPin);

    JsonObject param2 = array.createNestedObject();
    param2["piano1"] = analogRead(piano1Pin);

    JsonObject param3 = array.createNestedObject();
    param3["piano2"] = analogRead(piano2Pin);

    JsonObject param4 = array.createNestedObject();
    param4["other"] = analogRead(othersPin);

    JsonObject param5 = array.createNestedObject();
    param5["speed"] = getSpeed();

    JsonObject param6 = array.createNestedObject();
    param6["circle"] = rotaryCounter % 12;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    Serial.println(output);
  }
}