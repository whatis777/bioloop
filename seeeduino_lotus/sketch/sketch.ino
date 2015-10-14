
/**
 * GSR Sensor is connected to analog in A0
 */
const int GSR_SENSOR=A0;

/**
 * The timestamp when the las heartbeat occurred.
 */
volatile unsigned long lastHearbeat = 0;

/**
 * The delta in milliseconds between the last heartbeats.
 */
volatile unsigned int hearbeatDelta = 0;

/**
 * Timeout counter as indicator, whether heartbeat data (interrupt) is available or not.
 */
volatile unsigned int heartbeatDataTimeout = 0;



// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  attachInterrupt(0, interrupt, RISING);//set interrupt 0,digital port 2
}

// the loop routine runs over and over again forever:
void loop() {
  // read the GSR
  int gsrValue = analogRead(GSR_SENSOR);
  
  
  // Check indicator, if heartbeat data is available:
  if(heartbeatDataTimeout > 30) {
      hearbeatDelta = 0; // invalidate
  }
  
  heartbeatDataTimeout++; // increase timeout counter
  
  // Transmit data via serial port:
  sendMessage(gsrValue, hearbeatDelta);
  
  // delay(1);        // delay in between reads for stability
  delay(100); // ~10 Hz
}

/**
 * Send a message via serial port containing the given values.
 * 
 * Example: '{534;899}'
 * 
 * @param gsrValue The current GSR (galvanic skin response) value
 * @param heartbeatDelta The delta in milliseconds between the last two heatbeats, or 0, if invalid
 */
void sendMessage(int gsrValue, int heartbeatDeltaValue) {
  Serial.print('{');
  Serial.print(gsrValue);
  Serial.print(';');
  Serial.print(heartbeatDeltaValue);
  Serial.println('}');
}

/**
 * The ISR for every heartbeat.
 */
void interrupt() {
  unsigned long now = millis();
  
  // Reset timeout counter (indicates that heartbeat data is available):
  heartbeatDataTimeout = 0;
  
  hearbeatDelta = now - lastHearbeat;
  lastHearbeat = now;
}

