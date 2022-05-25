#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SocketIOclient.h>
#include <ArduinoJson.h>

SocketIOclient client;

// Network configuration
const char* ssid = "REPLACE_WITH_YOUR_SSID";
const char* password = "REPLACE_WITH_YOUR_PASSWORD";
const char *host = "INSERT HERE HOST ADDRESS";

// Control panel pins
const int masterSliderPin = 'A0';
const int piano1Pin = 'A1';
const int piano2Pin = 'A2';
const int drumsPin = 'A3';
const int bassPin = 'A4';
const int speedPin = 'A5';
const int pixelRing = '13';

const int rotaryPinA = '6';
const int rotaryPinB = '7';

int rotaryCounter = 0;
int rotaryAState;
int rotaryALastState;


DynamicJsonDocument doc(1024);

DynamicJsonDocument makeJson() {
  doc["masterSlider"] = analogRead(masterSliderPin);
  doc["piano1"] = analogRead(piano1Pin);
  doc["piano2"] = analogRead(piano2Pin);
  doc["other"] = analogRead(drumsPin);
  doc["speed"] = analogRead(speedPin);
  // add more here for rotary encoder
  return doc;
}

const int capacity = JSON_OBJECT_SIZE(6) + 50;
StaticJsonDocument <capacity> doc2;

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

void setup() {  
  Serial.begin(115200);

// Set up pins
  pinMode(masterSliderPin, INPUT);
  pinMode(speedPin, INPUT);
  pinMode(piano1Pin, INPUT);
  pinMode(piano2Pin, INPUT);
  pinMode(drumsPin, INPUT);
  pinMode(bassPin, INPUT);

  pinMode(rotaryPinA, INPUT);
  pinMode(rotaryPinB, INPUT);

  rotaryALastState = digitalRead(rotaryPinA);


  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  // Log the ESP32 local IP Address
  Serial.println(WiFi.localIP());
}
int count = 0;

void loop(){
    client.loop();
    count++;
    if (count == 18000){
        count = 0;

        // Send data to Server
        //client.emit("status", "Hello from esp32!");
    }
}