#include <Arduino.h>

#include <WiFi.h>
// #include <WiFiMulti.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#include <ArduinoJson.h>

// WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial

// Network configuration
const char *ssid = "REPLACE_WITH_YOUR_SSID";
const char *password = "REPLACE_WITH_YOUR_PASSWORD";
const char *host = "INSERT HERE HOST ADDRESS";

// Control panel pins
const int masterSliderPin = 'A0';
const int piano1Pin = 'A1';
const int piano2Pin = 'A2';
const int othersPin = 'A3';
const int speedPin = 'A5';
const int pixelRing = '13';

const int rotaryPinA = '6';
const int rotaryPinB = '7';

int rotaryCounter = 0;
int rotaryAState;
int rotaryALastState;

StaticJsonDocument<200> doc;

String makeJson(){

  String output;

  doc["masterVolume"] = analogRead(masterSliderPin);
  doc["piano1"] = analogRead(piano1Pin);
  doc["piano2"] = analogRead(piano2Pin);
  doc["other"] = analogRead(othersPin);
  doc["speed"] = getSpeed();
  doc["circle"] = rotaryCounter % 12;

  serializeJson(doc, output);

  return output;
}

int getSpeed()
{
  float analogValue = analogRead(speedPin);
  return map(analogValue, 0, 1023, 0, 100);
}

// Function to read the rotary encoder
void rotaryRead()
{
  rotaryAState = digitalRead(rotaryPinA);
  if (rotaryAState != rotaryALastState)
  {
    if (digitalRead(rotaryPinB) != rotaryALastState)
    {
      rotaryCounter++;
    }
    else
    {
      rotaryCounter--;
    }
  }
  rotaryALastState = rotaryAState;
}

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
  case sIOtype_DISCONNECT:
    USE_SERIAL.printf("[IOc] Disconnected!\n");
    break;
  case sIOtype_CONNECT:
    USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

    // join default namespace (no auto join in Socket.IO V3)
    socketIO.send(sIOtype_CONNECT, "/");
    break;
  case sIOtype_EVENT:
  {
    char *sptr = NULL;
    int id = strtol((char *)payload, &sptr, 10);
    USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
    if (id)
    {
      payload = (uint8_t *)sptr;
    }
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload, length);
    if (error)
    {
      USE_SERIAL.print(F("deserializeJson() failed: "));
      USE_SERIAL.println(error.c_str());
      return;
    }

    String eventName = doc[0];
    USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

    // Message Includes a ID for a ACK (callback)
    if (id)
    {
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
    USE_SERIAL.printf("[IOc] get ack: %u\n", length);
    break;
  case sIOtype_ERROR:
    USE_SERIAL.printf("[IOc] get error: %u\n", length);
    break;
  case sIOtype_BINARY_EVENT:
    USE_SERIAL.printf("[IOc] get binary: %u\n", length);
    break;
  case sIOtype_BINARY_ACK:
    USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
    break;
  }
}

////////////////////
// MAIN FUNCTIONS //
////////////////////
void setup()
{
  USE_SERIAL.begin(9600);

  USE_SERIAL.println("Booting...");
  USE_SERIAL.println("");
  USE_SERIAL.println("");

  for (uint8_t t = 4; t > 0; t--)
  {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    USE_SERIAL.println("Connecting to WiFi..");
  }

  // Log the ESP32 local IP Address
  USE_SERIAL.println(WiFi.localIP());

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

    if(now - messageTimestamp > 2000) {
        messageTimestamp = now;

        // creat JSON message for Socket.IO (event)
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();

        // add evnet name
        // Hint: socket.on('event_name', ....
        array.add("event_name");

        // add payload (parameters) for the event
        JsonObject param1 = array.createNestedObject();
        param1["now"] = (uint32_t) now;

        // JSON to String (serializion)
        String output;
        serializeJson(doc, output);

        // Send event
        socketIO.sendEVENT(output);

        // Print JSON for debugging
        USE_SERIAL.println(output);
    }
}