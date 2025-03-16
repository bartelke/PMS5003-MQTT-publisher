const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
  path: '/dev/ttyS0',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
}, (err) => {
  if (err) {
    console.error('Error opening port:', err.message);
  } else {
    console.log('Serial port opened!');
  }
});

let buffer = [];

// Read raw data (Buffer) from the serial port
port.on('data', (data) => {
  // Add data to the buffer
  buffer = buffer.concat(Array.from(data));

  // Check if the buffer contains at least 32 bytes
  while (buffer.length >= 32) {
    // Check the frame header (0x42 0x4D)
    const header = [buffer[0], buffer[1]];
    if (header[0] === 0x42 && header[1] === 0x4D) {
      // If the frame start is correct, read the data
      const frame = buffer.slice(0, 32);

      // Read PM1.0, PM2.5, PM10 data
      const pm1_0 = (frame[4] << 8) + frame[5]; // PM1.0
      const pm2_5 = (frame[6] << 8) + frame[7]; // PM2.5
      const pm10 = (frame[8] << 8) + frame[9];  // PM10

      // Display the read data
      console.log(`PM1.0: ${pm1_0} µg/m³`);
      console.log(`PM2.5: ${pm2_5} µg/m³`);
      console.log(`PM10: ${pm10} µg/m³ \n`);

      // Remove the frame from the buffer
      buffer = buffer.slice(32);
    } else {
      // If the frame start is incorrect, remove the first byte
      buffer = buffer.slice(1);
    }
  }
});
