#include <Arduino.h>

int hiHatPin = 9;
int crashPiezoPin = A0;
int kickPiezoPin = A1;

const int kickThreshold = 750;
const int crashThreshold = 800;

int crashReading = 0;
int kickReading = 0;
int buttonReading = 0;

int buttonState = LOW;

bool debug = false;

void setup()
{
  pinMode(hiHatPin, INPUT_PULLUP);
  pinMode(crashPiezoPin, INPUT);
  pinMode(kickPiezoPin, INPUT);

  Serial.begin(9600);

  pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{

  // for testing
  digitalWrite(LED_BUILTIN, HIGH); // turn the LED on (HIGH is the voltage level)
  delay(50);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);

  crashReading = analogRead(crashPiezoPin);
  kickReading = analogRead(kickPiezoPin);
  buttonReading = digitalRead(hiHatPin);

  if (crashReading >= crashThreshold)
  {
    Serial.println("Crash!");
  }

  if (kickReading >= kickThreshold)
  {
    Serial.println("Kick!");
  }

  if (buttonReading == LOW) {
    Serial.println("HiHat!");
  }
  if (debug)
  {
    Serial.println("");
    Serial.print("crashReading: ");
    Serial.println(crashReading);
    Serial.print("kickReading: ");
    Serial.println(kickReading);
    Serial.print("buttonReading: ");
    Serial.println(buttonReading);
  }

  delay(100);

}
