const mqtt = require('mqtt');
const { SerialPort } = require('serialport');
require('dotenv').config();

// remember to set your topic:
const topic = '[your_topic]';

// serial port config
const port = new SerialPort({
  path: '/dev/ttyS0',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
});

let buffer = [];

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

port.on('data', (data) => {
  buffer.push(...data);
  let pmData = '';

  while (buffer.length >= 32) {
    // identify data frame (starting with 42 4D)
    if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
      const frame = buffer.slice(0, 32);

      // handle checksum:
      const checksum = frame.slice(0, 30).reduce((sum, val) => sum + val, 0);
      const receivedChecksum = (frame[30] << 8) + frame[31];

      if (checksum === receivedChecksum) {
        // decode frame:
        const pm1_0 = (frame[4] << 8) + frame[5];
        const pm2_5 = (frame[6] << 8) + frame[7];
        const pm10 = (frame[8] << 8) + frame[9];

        pmData = JSON.stringify({
          pm1_0: pm1_0,
          pm2_5: pm2_5,
          pm10: pm10,
          timestamp: new Date().toISOString(),
        });

        publishToBroker(pmData);
      } else {
        console.warn('Checksum error! Discarding frame.');
      }

      buffer = buffer.slice(32);
    } else {
      buffer.shift();
    }
  }
});

function publishToBroker(data) {
  const brokerUrl = process.env.BROKER_URL;

  const options = {
    clientId: `mqtt_client_${Math.random().toString(16).substr(2, 8)}`,
    username: process.env.MQTT_USERNAME,  
    password: process.env.MQTT_PASSWORD,
    port: process.env.MQTT_PORT,
  };

  // set connection with MQTT broker
  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('HiveMQ connected!');
  
    // Publish data frame:
    client.publish(topic, data, { qos: 1, retain: false }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Data published!');
      }
  
      client.end();
    });
  });

  client.on('error', (error) => {
    console.error('Error with MQTT broker: ', error);
  });
}
