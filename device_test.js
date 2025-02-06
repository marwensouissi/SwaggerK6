import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import http from 'k6/http';

// ✅ Configuration
const broker = "mqtt://dev-itona.xyz"; // ✅ Broker URL
const port = "1883";  // ✅ MQTT Port (Use 8883 for TLS)
const username = "Tij6ROj0bzNlbLK0sid4";  // ✅ Access Token (Used as Username)
const password = "";  // ✅ No Password
const clientId = `k6-client-${__VU}`; // ✅ Unique Client ID per test
const topic = "v1/devices/me/telemetry";
const BASE_URL = 'https://dev-itona.xyz/api';

let token = null;
let deviceId = null;
let credentialsId = null;

// ✅ MQTT Client Configuration
let publisher = new mqtt.Client(
    [`${broker}:${port}`],  // ✅ Correct Broker URL
    username,  // ✅ Username (Access Token)
    password,  // ✅ No Password
    false,  // ✅ Clean session
    clientId,  // ✅ Unique Client ID
    5000, // ✅ Connection Timeout
    "",  // ✅ Root CA Cert (If required)
    "",  // ✅ Client Certificate Path
    "",  // ✅ Client Key Path
    {
        sentBytesLabel: "mqtt_sent_bytes",
        receivedBytesLabel: "mqtt_received_bytes",
        sentMessagesCountLabel: "mqtt_sent_messages_count",
        receivedMessagesCountLabel: "mqtt_received_messages_count",
    },
    false,  // ✅ Ignore TLS errors (if necessary)
    "TLS 1.2"  // ✅ Minimum TLS version
);

let err;

// ✅ Establish MQTT Connection
try {
    console.log("🚀 Connecting Publisher to MQTT Broker...");
    publisher.connect();
    console.log("✅ Publisher Connected!");
} catch (error) {
    err = error;
    console.error("❌ Publisher Connection Failed!", err);
}

const CREDENTIALS = { 
    username: "marwen.souissi00@gmail.com", 
    password: "marwen123" 
};

function login() {
    console.log("🔑 Logging in...");
    let loginPayload = JSON.stringify(CREDENTIALS);
    let headers = { 'Content-Type': 'application/json' };

    let res = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

    let success = check(res, {
        '✅ Login Successful': (r) => r.status === 200 && r.json('token') !== undefined,
    });

    if (!success) {
        console.error('❌ Login Failed!', res.body);
        return null;
    }

    token = res.json().token;
    console.log(`🔑 Auth Token Acquired: ${token}`);
}

function generateUniqueName() {
    return "device-" + Math.random().toString(36).substring(2, 10);
}

function createDevice() {
    console.log("📡 Creating a new device...");
    if (!token) {
        console.error("❌ Token is not available. Cannot create device.");
        return;
    }
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    let payload = JSON.stringify({
        "name": generateUniqueName(),
        "label": "Test Device",
        "additionalInfo": {}
    });

    let res = http.post(`${BASE_URL}/device`, payload, { headers });
    let deviceData = res.json();

    if (!deviceData || !deviceData.id || !deviceData.id.id) {
        console.error("❌ Failed to create device!", res.body);
        return;
    }

    deviceId = deviceData.id.id;
    console.log(`📡 Device Created: ${deviceId}`);
}

function fetchAccessToken() {
    console.log(`🔑 Fetching credentials for Device ID: ${deviceId}`);
    if (!token || !deviceId) {
        console.error("❌ Missing token or deviceId. Cannot fetch access token.");
        return;
    }
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    let res = http.get(`${BASE_URL}/device/${deviceId}/credentials`, { headers });
    let credentialsData = res.json();

    if (!credentialsData || !credentialsData.credentialsId) {
        console.error("❌ Failed to fetch credentials!", res.body);
        return;
    }

    credentialsId = credentialsData.credentialsId;
    console.log(`🔑 Retrieved Credentials ID: ${credentialsId}`);
}

export default function () {
    login();
    createDevice();
    fetchAccessToken();
    
    // ✅ Publish Telemetry Data
    let payload = JSON.stringify({
        temperature: (Math.random() * 50).toFixed(2),
        humidity: (Math.random() * 100).toFixed(2),
    });

    try {
        console.log(`📡 Publishing to topic: ${topic}`);
        publisher.publish(topic, 1, payload, false, 5000);
        console.log(`✅ Message Sent: ${payload}`);
    } catch (error) {
        console.error("❌ Publish Failed!", error);
    }

    sleep(2);
}

// ✅ Close MQTT Connection at End
export function teardown() {
    console.log("🔌 Closing MQTT Connection...");
    publisher.close(2000);
}
