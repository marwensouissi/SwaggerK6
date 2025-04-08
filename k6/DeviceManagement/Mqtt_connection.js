import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import { SharedArray } from 'k6/data';

// ✅ K6 Load Testing Options
export let options = {
    vus: 4,
    duration: '1m', // you can increase this
};

// ✅ Load credentials from JSON file
const credentialsData = new SharedArray('device_credentials', function () {
    try {
        return JSON.parse(open('./device_credentials.json'));
    } catch (error) {
        console.error("❌ Failed to load credentials file:", error);
        return [];
    }
});

// ✅ Ensure credentials exist
if (credentialsData.length === 0) {
    throw new Error("❌ No credentials found in device_credentials.json");
}

// ✅ MQTT Config
const broker = "mqtt://dev-itona.xyz";
const port = "1883";
const password = "YourPasswordIfRequired";

// ✅ MQTT Clients Storage
const publishers = {};

// ✅ Setup connections outside of default
console.log("🚀 Global Setup: Initializing MQTT connections...");

for (let i = 1; i <= options.vus; i++) {
    const vuIndex = (i - 1) % credentialsData.length;
    const cred = credentialsData[vuIndex];

    const credentialsId = cred.credentialsId || `default-${i}`;
    const clientId = `k6-client-${i}`;

    console.log(`✅ VU ${i} using credentialsId: ${credentialsId}`);

    try {
        const client = new mqtt.Client(
            [`${broker}:${port}`],
            credentialsId,
            password,
            false,
            clientId,
            5000,
            "",
            "",
            "",
            {
                sentBytesLabel: "mqtt_sent_bytes",
                receivedBytesLabel: "mqtt_received_bytes",
                sentMessagesCountLabel: "mqtt_sent_messages_count",
                receivedMessagesCountLabel: "mqtt_received_messages_count",
            },
            false,
            "TLS 1.2"
        );

        client.connect();
        console.log(`📡 VU ${i} connected to MQTT broker.`);
        publishers[i] = client;
    } catch (err) {
        console.error(`❌ Failed to connect VU ${i}:`, err);
    }
}

// ✅ Main test per VU
export default function () {
    const client = publishers[__VU];
    if (!client) {
        console.error(`❌ No client found for VU ${__VU}`);
        return;
    }

    const credIndex = (__VU - 1) % credentialsData.length;
    const credentialsId = credentialsData[credIndex].credentialsId;
    const deviceTopic = "v1/devices/me/telemetry";

    for (let i = 0; i < 5; i++) {
        const payload = JSON.stringify({
            device_id: credentialsId,
            temperature: (Math.random() * 50).toFixed(2),
            humidity: (Math.random() * 100).toFixed(2),
            timestamp: new Date().toISOString(),
        });

        try {
            console.log(`📤 VU ${__VU} publishing to ${deviceTopic}`);
            client.publish(deviceTopic, 1, payload, true, 5000);
        } catch (err) {
            console.error(`❌ Failed to publish from VU ${__VU}:`, err);
        }

        sleep(0.2); // 5 messages per second
    }
}

// ✅ Clean up MQTT connections
export function teardown() {
    console.log("🔌 Teardown: Closing MQTT connections...");
    for (let i in publishers) {
        if (publishers[i]) {
            publishers[i].close();
            console.log(`✅ VU ${i} disconnected.`);
        }
    }
}
