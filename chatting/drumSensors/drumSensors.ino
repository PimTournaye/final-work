#define HI_HAT_SWITCH 13
#define CRASH_PIEZO_PIN A0
#define KICK_PIEZO_PIN A1

const int threshold = 100;

int crashReading = 0;
int kickReading = 0;

void setup(){
    pinMode(HI_HAT_SWITCH, INPUT);
    pinMode(CRASH_PIEZO_PIN, INPUT);
    pinMode(KICK_PIEZO_PIN, INPUT);

    Serial.begin(9600);
}

void loop(){

  crashReading = analogRead(CRASH_PIEZO_PIN);
  kickReading = analogRead(KICK_PIEZO_PIN);
  buttonReading = digitalRead(HI_HAT_SWITCH)

  if (crashReading >= threshold) {
    Serial.println("Crash!");
  }

  if (kickReading >= threshold){
    Serial.println("Kick!");
  }

  if (buttonReading == HIGH) {
    Serial.println("HiHat!");   
  }

  delay(100);
  
    

