# PMS5003 MQTT Publisher

This is a Node.js project that uses the `serialport` library to interface with the **PMS5003** particulate matter sensor and publish data to an external **MQTT broker**.

The **PMS5003** sensor is a popular air quality sensor that measures particulate matter (PM1, PM2.5, and PM10) in the air. This project reads data from the PMS5003 sensor via a serial port connection and publishes the data to an MQTT broker for further use. For more information, check out the [PMS5003 Sensor Documentation](https://botland.com.pl/index.php?controller=attachment&id_attachment=1819).

## Requirements

- Node.js (version 12 or later)
- `serialport` library to communicate with the PMS5003 sensor
- `mqtt` library to publish data to an MQTT broker

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your_username/PMS5003-MQTT-publisher.git
   cd PMS5003-MQTT-publisher
   
2. **Install dependencies**:
   ```bash
   npm install
   
3. **Create a `.env` file**:
   
   In the root of your project, create a `.env` file to store your MQTT credentials and broker details. The file should look like this:

   ```env
   MQTT_USERNAME=your_username
   MQTT_PASSWORD=your_MQTT_password
   MQTT_PORT=port_for_your_service
   BROKER_URL=your_service_url

   Please remember to also set up your topic in the code.

4. **Run the application**:
   After configuring the `.env` file with your credentials, run the application:

   ```bash
   npm start
