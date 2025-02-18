import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import { SharedArray } from 'k6/data';

// ✅ K6 Load Testing Options
export let options = {
    vus: 4,        // Number of Virtual Users (Each VU represents a different device)
    duration: '60s' // Run for 60 seconds
};

// ✅ Load credentials from JSON file
const credentialsData = new SharedArray('device_credentials', function () {
    let data;
    try {
        data = JSON.parse(open('./device_credentials.json'));
    } catch (error) {
        console.error("❌ Failed to load credentials file!", error);
        return [];
    }
    return Array.isArray(data) ? data : [];
});

// ✅ Ensure credentials exist
if (credentialsData.length === 0) {
    throw new Error("❌ No credentials available! Ensure `device_credentials.json` is not empty.");
}

// ✅ MQTT Broker Configuration
const broker = "mqtt://dev-itona.xyz";
const port = "1883";  // MQTT Port
const password = "YourPasswordIfRequired"; // Set a password if needed

// ✅ Global MQTT Clients Storage (Each VU gets its own connection)
let publishers = {};

// ✅ MQTT Connection Setup - Run Once Per VU (Before Default Function)
console.log("🚀 Initializing MQTT connections for all Virtual Users...");

for (let i = 1; i <= options.vus; i++) {
    const vuIndex = (i - 1) % credentialsData.length;
    const credentials = credentialsData[vuIndex];

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

// ✅ Main Test Execution - Runs Per VU
export default function () {
    if (!publishers[__VU]) {
        console.error(`❌ MQTT Publisher not initialized for VU ${__VU}!`);
        return;
    }

    const credentialsId = credentialsData[(__VU - 1) % credentialsData.length].credentialsId;
    const deviceTopic = `v1/devices/me/telemetry`;  // Modify if needed per device

    for (let i = 0; i < 5; i++) {  // Send 5 messages per second
        let payload = JSON.stringify({
            device_id: credentialsId,
            temperature: (Math.random() * 50).toFixed(2),
            humidity: (Math.random() * 100).toFixed(2),
            timestamp: new Date().toISOString()
        });

        try {
            console.log(`📡 VU ${__VU} Publishing to topic: ${deviceTopic}`);
            publishers[__VU].publish(deviceTopic, 1, payload, true, 5000);  // Retain = true
            console.log(`✅ VU ${__VU} Message Sent: ${payload}`);
        } catch (error) {
            console.error(`❌ VU ${__VU} Publish Failed!`, error);
        }

        sleep(0.2);  // 5 messages per second (1/5 = 0.2s per message)
    }
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
