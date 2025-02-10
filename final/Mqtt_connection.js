import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import { SharedArray } from 'k6/data';

// ✅ K6 Options
export let options = {
    vus: 3,        // Number of Virtual Users
    iterations: 3  // Each VU runs this many times
};

// ✅ Load credentials from file using SharedArray
const credentialsData = new SharedArray('device_credentials', function () {
    let data;
    try {
        data = JSON.parse(open('./device_credentials.json'));
    } catch (error) {
        console.error("❌ Failed to load credentials file!", error);
        return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
        console.error("❌ No credentials found in device_credentials.json!");
        return [];
    }

    return data;
});

// ✅ Ensure we have enough credentials
if (credentialsData.length === 0) {
    throw new Error("❌ No credentials available! Ensure `device_credentials.json` is not empty.");
}

const broker = "mqtt://dev-itona.xyz"; 
const port = "1883";  
const password = "";  
const topic = "v1/devices/me/telemetry";

// ✅ Global MQTT Clients Storage (Each VU Uses Its Own)
let publishers = {};

// ✅ Ensure MQTT Clients Are Initialized Only Once
if (Object.keys(publishers).length === 0) {
    console.log("🚀 Initializing MQTT clients for all VUs...");

    for (let i = 1; i <= options.vus; i++) {
        const index = (i - 1) % credentialsData.length;
        const credentials = credentialsData[index];

        if (!credentials || !credentials.credentialsId) {
            console.error(`❌ VU ${i} failed to retrieve credentialsId.`);
            continue;
        }

        const credentialsId = credentials.credentialsId;
        const clientId = `k6-client-${i}`;

        console.log(`✅ VU ${i} assigned credentialsId: ${credentialsId}`);

        try {
            publishers[i] = new mqtt.Client(
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

            console.log(`🚀 VU ${i} Connecting to MQTT Broker...`);
            publishers[i].connect();
            console.log(`✅ VU ${i} Connected to MQTT!`);
        } catch (error) {
            console.error(`❌ VU ${i} Connection Failed!`, error);
        }
    }
}

// ✅ Each VU Uses Its Pre-Initialized MQTT Client
export default function () {
    if (!publishers[__VU]) {
        console.error(`❌ MQTT Publisher not initialized for VU ${__VU}!`);
        return;
    }

    let payload = JSON.stringify({
        temperature: (Math.random() * 50).toFixed(2),
        humidity: (Math.random() * 100).toFixed(2),
        timestamp: new Date().toISOString()
    });

    try {
        console.log(`📡 VU ${__VU} Publishing to topic: ${topic}`);
        publishers[__VU].publish(topic, 1, payload, false, 5000);
        console.log(`✅ VU ${__VU} Message Sent: ${payload}`);
    } catch (error) {
        console.error(`❌ VU ${__VU} Publish Failed!`, error);
    }

    sleep(2);
}

// ✅ Cleanup: Close All MQTT Connections at End
export function teardown() {
    console.log("🔌 Closing all MQTT Connections...");
    for (let i in publishers) {
        if (publishers[i]) {
            publishers[i].close();
            console.log(`✅ VU ${i} Disconnected from MQTT.`);
        }
    }
}
