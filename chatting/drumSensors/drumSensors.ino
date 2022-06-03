#define HI_HAT_SWITCH 11
#define CRASH_PIEZO_PIN A0
#define KICK_PIEZO_PIN A1

const int threshold = 500;

int crashReading = 0;
int kickReading = 0;

void setup(){
    pinMode(HI_HAT_SWITCH, INPUT);
    pinMode(CRASH_PIEZO_PIN, INPUT);
    pinMode(KICK_PIEZO_PIN, INPUT);

    Serial.begin(9600);

    pinMode(LED_BUILTIN, OUTPUT);
}

void loop(){

 // for testing
 digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);

  crashReading = analogRead(CRASH_PIEZO_PIN);
  kickReading = analogRead(KICK_PIEZO_PIN);
  int buttonReading = digitalRead(HI_HAT_SWITCH);

  if (crashReading >= threshold) {
    Serial.println("Crash!");
  }

  if (kickReading >= threshold){
    Serial.println("Kick!");
  }

  if (buttonReading == HIGH) {
    Serial.println("HiHat!");   
  }

  delay(200);

  Serial.println('loop complete');
  
    
}
