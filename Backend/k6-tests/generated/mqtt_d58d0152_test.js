import { sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import { SharedArray } from 'k6/data';
import { check } from 'k6';

// Shared credentials list using SharedArray (inline, not file-based)
const credentialsData = new SharedArray('device_credentials', () => {
    return [
        { credentialsId: "Yn3hxWgvH38sxDuBW8YQ" },        { credentialsId: "W3jSBLMevf9sgoRz2gpG" },        { credentialsId: "iLML17hiKMxHf18zQyxV" },        { credentialsId: "WlyGZdbNIsnv4c7QSNNr" },        { credentialsId: "5g7OthZOw3TFPuOyJ1Jx" },        { credentialsId: "zMpXkamkSwLwH2cBfgzr" },        { credentialsId: "G3Cs1I9IpeBLKCdFsbyD" },        { credentialsId: "eMG4uDUIi61pLu5rhDhW" },        { credentialsId: "PRpL4Qs9nFmtX1cHa5f3" },        { credentialsId: "KSoELD1HCI43GNbrpVez" },        { credentialsId: "RsvV1KJN1argnsdOFLNd" },        { credentialsId: "bPEkVkXi785bkjefbmig" },        { credentialsId: "W8iTIhIsjxsphrkOXebY" },        { credentialsId: "BDXvI7WPh8oKJ5pmdAsC" },        { credentialsId: "oYGY5Lol1G5DVNovkaf3" },        { credentialsId: "c7rJziq6wRMwXF6K8fAP" }    ];
});

const VU_COUNT = 10;
const BUFFER_TIME = 5;

export const options = {
    vus: VU_COUNT,
    duration: '0.5',
    preAllocatedVUs: VU_COUNT,
};

const broker = "mqtt://164.90.243.134";
const port = "8883";
const topic = "v1/devices/me/telemetry";
const password = "None";

const clients = new Array(VU_COUNT);

// Create clients using inline credentials from SharedArray
for (let i = 0; i < VU_COUNT; i++) {
    const { credentialsId } = credentialsData[i % credentialsData.length]; // Safe wrap
    const clientId = `k6-client-${i + 1}`;

    try {
        const client = new mqtt.Client(
            [`${broker}:${port}`],
            credentialsId,
            password,
            false,
            clientId,
            5000,
            "", "", "",
            {
                sentBytesLabel: "mqtt_sent_bytes",
                receivedBytesLabel: "mqtt_received_bytes",
                sentMessagesCountLabel: "mqtt_sent_messages_count",
                receivedMessagesCountLabel: "mqtt_received_messages_count",
            },
            false,
        );
        clients[i] = client;
        console.log(`✅ Client ${i + 1} connected with credentialsId ${ credentialsId }`);
    } catch (err) {
        console.error(`❌ Client ${i + 1} connection failed`, err);
    }
}

// Main test loop
export default function () {
    const vuId = __VU;
    const client = clients[(vuId - 1) % clients.length]; // Safe index

    if (!client) {
        console.error(`❌ No MQTT client for VU ${vuId}`);
        return;
    }

    client.connect();
    sleep(2);

    check(client, {
        "is publisher connected": publisher => publisher.isConnected()
    });

    for (let i = 0; i < 5; i++) {
        try {
            const payload = JSON.stringify({
                temperature: (Math.random() * 50).toFixed(2),
                humidity: (Math.random() * 100).toFixed(2),
                timestamp: new Date().toISOString()
            });
            client.publish(topic, 1, payload, false, 5000);
            console.log(`📡 VU ${vuId} published: ${payload}`);
        } catch (err) {
            console.error(`❌ VU ${vuId} publish failed`, err);
        }
        sleep(BUFFER_TIME);
    }
}

// Graceful shutdown
export function teardown() {
    console.log("🔌 Disconnecting MQTT clients...");
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        if (client) {
            try {
                client.close();
                console.log(`✅ Client ${i + 1} disconnected`);
            } catch (err) {
                console.error(`❌ Error disconnecting client ${i + 1}`, err);
            }
        }
    }
}