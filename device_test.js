import { check, sleep } from 'k6';
import mqtt from 'k6/x/mqtt';
import http from 'k6/http';

// ✅ Configuration
const broker = "mqtt://dev-itona.xyz"; 
const port = "1883"; 
const username = "Tij6ROj0bzNlbLK0sid4"; 
const password = "";  
const clientId = `k6-client-${__VU}`;
const topic = "v1/devices/me/telemetry";
const BASE_URL = 'https://dev-itona.xyz/api';

let token = null;
let deviceId = null;
let credentialsId = null;



const CREDENTIALS = { 
    username: "marwen.souissi00@gmail.com", 
    password: "marwen123" 
};


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



        console.log("📡 Creating a new device...");
        if (!token) {
            console.error("❌ Token is not available. Cannot create device.");
            return;
        }
        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    
        let payload = JSON.stringify({
            "name": generateUniqueName(),
            "label": "Test Device",
            "additionalInfo": {}
        });
    
        let resp = http.post(`${BASE_URL}/device`, payload, { header });
        let deviceData = resp.json();
    
        if (!deviceData || !deviceData.id || !deviceData.id.id) {
            console.error("❌ Failed to create device!", resp.body);
            return;
        }
    
        deviceId = deviceData.id.id;
        console.log(`📡 Device Created: ${deviceId}`);




            console.log(`🔑 Fetching credentials for Device ID: ${deviceId}`);
            if (!token || !deviceId) {
                console.error("❌ Missing token or deviceId. Cannot fetch access token.");
                return;
            }
            let headerss = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };
        
            let respo = http.get(`${BASE_URL}/device/${deviceId}/credentials`, { headerss });
            let credentialsData = respo.json();
        
            if (!credentialsData || !credentialsData.credentialsId) {
                console.error("❌ Failed to fetch credentials!", respo.body);
                return;
            }
        
            credentialsId = credentialsData.credentialsId;
            console.log(`🔑 Retrieved Credentials ID: ${credentialsId}`);
            console.log(`🔑 Retrieved Credentials ID: ${credentialsId}`);
            console.log(`🔑 Retrieved Credentials ID: ${credentialsId}`);






            // ✅ MQTT Client Configuration
            let publisher = new mqtt.Client(
                [`${broker}:${port}`], 
                username,  
                credentialsId, 
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

            let err;
        
    

// ✅ Establish MQTT Connection
try {
    console.log("🚀 Connecting Publisher to MQTT Broker...");
    publisher.connect();
    console.log("✅ Publisher Connected!");
    } 
    catch (error) {
    err = error;
    console.error("❌ Publisher Connection Failed!", err);
    }



    // function login() {
    //     console.log("🔑 Logging in...");
    //     let loginPayload = JSON.stringify(CREDENTIALS);
    //     let headers = { 'Content-Type': 'application/json' };

    //     let res = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

    //     let success = check(res, {
    //         '✅ Login Successful': (r) => r.status === 200 && r.json('token') !== undefined,
    //     });

    //     if (!success) {
    //         console.error('❌ Login Failed!', res.body);
    //         return null;
    //     }

    //     token = res.json().token;
    //     console.log(`🔑 Auth Token Acquired: ${token}`);
    // }


    function generateUniqueName() {
        return "device-" + Math.random().toString(36).substring(2, 10);
    }


    export default function () {

    
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
