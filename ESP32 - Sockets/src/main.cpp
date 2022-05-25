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

const int masterSliderPin = 'A0';
const int circleOfFifthsPin = '11';
const int piano1Pin = 'A1';
const int piano2Pin = 'A2';
const int drumsPin = 'A3';
const int bassPin = 'A4';
const int speedPin = 'A5';

void setup() {  
  Serial.begin(115200);

// Set up pins
  pinMode(masterSliderPin, INPUT);
  pinMode(circleOfFifthsPin, INPUT);
  pinMode(speedPin, INPUT);
  pinMode(piano1Pin, INPUT);
  pinMode(piano2Pin, INPUT);
  pinMode(drumsPin, INPUT);
  pinMode(bassPin, INPUT);

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