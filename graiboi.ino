int audioOut = 0;
int bendWheel = 2;

void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:
int bendWheelState = analogRead(bendWheel);
bendWheelState = map(bendWheelState,830,1023,100,900);
tone(audioOut,bendWheelState,100);
}
