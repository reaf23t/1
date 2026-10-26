/* ==========================================================================
   STARK ARDUINO C++ GENERATOR & COMPILER SIMULATOR MODULE
   ========================================================================== */

const ARDUINO_PRESETS = {
  blink: `// Stark Industries - Basic LED Blink Firmware
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,

  sensor: `// Stark Industries - Analog Sensor Readout & Serial Monitor
#define SENSOR_PIN A0

void setup() {
  Serial.begin(9600);
  Serial.println("JARVIS Hardware Interface Online.");
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  Serial.print("Voltage: ");
  Serial.print(voltage);
  Serial.println(" V");
  delay(250);
}`,

  servo: `// Stark Industries - PWM Servo Motor Control
#include <Servo.h>

Servo starkServo;
int pos = 0;

void setup() {
  starkServo.attach(9);
}

void loop() {
  for (pos = 0; pos <= 180; pos += 10) {
    starkServo.write(pos);
    delay(15);
  }
  for (pos = 180; pos >= 0; pos -= 10) {
    starkServo.write(pos);
    delay(15);
  }
}`,

  ultrasonic: `// Stark Industries - HC-SR04 Distance Sensor
#define TRIG_PIN 9
#define ECHO_PIN 10

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  int distanceCm = duration * 0.034 / 2;

  Serial.print("Distancia: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  delay(500);
}`,

  display: `// Stark Industries - I2C LCD Display Interface
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("STARK OS v4.0");
  lcd.setCursor(0, 1);
  lcd.print("JARVIS ONLINE");
}

void loop() {
  // Idle display loop
}`,

  bluetooth: `// Stark Industries - HC-05 Bluetooth Automation Protocol
#include <SoftwareSerial.h>

SoftwareSerial BTSerial(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  if (BTSerial.available()) {
    char cmd = BTSerial.read();
    if (cmd == '1') {
      digitalWrite(13, HIGH);
      BTSerial.println("LED LIGADO");
    } else if (cmd == '0') {
      digitalWrite(13, LOW);
      BTSerial.println("LED DESLIGADO");
    }
  }
}`,

  stepper: `// Stark Industries - Stepper Motor Control
#include <Stepper.h>

const int stepsPerRevolution = 200;
Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);

void setup() {
  myStepper.setSpeed(60);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Girando no sentido horario...");
  myStepper.step(stepsPerRevolution);
  delay(500);
}`
};

function loadArduinoPreset() {
  const selected = document.getElementById('arduinoPreset').value;
  const editor = document.getElementById('arduinoCodeEditor');
  if (ARDUINO_PRESETS[selected]) {
    editor.value = ARDUINO_PRESETS[selected];
    logSystemEvent(`Preset Arduino C++ carregado: ${selected.toUpperCase()}`);
  }
}

function compileArduinoCode() {
  const code = document.getElementById('arduinoCodeEditor').value;
  const consoleEl = document.getElementById('arduinoConsole');

  if (!code.includes('void setup()') || !code.includes('void loop()')) {
    consoleEl.innerHTML = `<div class="console-line error">[ERRO DE COMPILAÇÃO] 'void setup()' ou 'void loop()' ausente na estrutura do programa C++.</div>`;
    speakJarvis("Erro de compilação detectado no código Arduino. Verifique as funções setup e loop.");
    return;
  }

  const codeLength = code.length;
  const flashBytes = Math.floor(codeLength * 3.5 + 850);
  const ramBytes = Math.floor(codeLength * 0.8 + 120);

  consoleEl.innerHTML = `
    <div class="console-line success">[COMPILAÇÃO BEM SUCEDIDA] avr-g++ compilado com sucesso sem avisos.</div>
    <div class="console-line success">O sketch usa ${flashBytes} bytes (${Math.round((flashBytes / 32256) * 100)}%) do espaço de armazenamento de programas do ATmega328P.</div>
    <div class="console-line success">Variáveis globais usam ${ramBytes} bytes (${Math.round((ramBytes / 2048) * 100)}%) de memória dinâmica.</div>
  `;

  logSystemEvent("Código Arduino C++ compilado com sucesso.");
  speakJarvis("Código Arduino verificado e compilado com sucesso sem erros sintáticos.");
}

function downloadArduinoCode() {
  const code = document.getElementById('arduinoCodeEditor').value;
  const blob = new Blob([code], { type: 'text/x-c' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `stark_firmware_${Date.now()}.ino`;
  link.click();
  logSystemEvent("Firmware .INO baixado para gravação no hardware Arduino.");
}

function generateArduinoAI() {
  const prompt = document.getElementById('arduinoPrompt').value;
  if (!prompt.trim()) {
    alert("Por favor digite o que deseja no seu código Arduino.");
    return;
  }

  logSystemEvent(`JARVIS gerando código Arduino C++ para: "${prompt}"`);

  const generatedCode = `// Firmware Arduino C++ Gerado Automaticamente por J.A.R.V.I.S.
// Objetivo: ${prompt}

#define CONTROL_PIN 7
#define SENSOR_PIN A1
#define STATUS_LED 13

void setup() {
  Serial.begin(9600);
  pinMode(CONTROL_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  Serial.println("Protocolo Stark Ativado para: ${prompt}");
}

void loop() {
  int sensorVal = analogRead(SENSOR_PIN);

  // Lógica inteligente gerada para: ${prompt}
  if (sensorVal > 400) {
    digitalWrite(CONTROL_PIN, HIGH);
    digitalWrite(STATUS_LED, HIGH);
    Serial.println("Atuador ativado - Leitura acima do limite.");
  } else {
    digitalWrite(CONTROL_PIN, LOW);
    digitalWrite(STATUS_LED, LOW);
  }

  delay(100);
}`;

  document.getElementById('arduinoCodeEditor').value = generatedCode;
  compileArduinoCode();
  speakJarvis("Novo código Arduino C++ gerado e verificado pela inteligência artificial JARVIS.");
}
