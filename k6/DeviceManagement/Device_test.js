import http from 'k6/http';
import { check, sleep } from 'k6';
import file from 'k6/x/file';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// ✅ Configuration
const BASE_URL = 'https://dev-itona.xyz/api';
const VERIFICATION_CODE = '123456';
const PASSWORD = '123123';

// ✅ Set file path to match Jenkins mounted volume
const FILE_PATH = "/app/final/device_credentials.json";

// ✅ K6 Load Options
export let options = {
    vus: 3,       // Simulate 3 virtual users
    iterations: 3 // Each VU runs 3 times
};

// ✅ Function: Read & Write to JSON File
function saveCredentialsToFile(credentialsId) {
    let existingData = [];

    try {
        // ✅ Read existing file content if available
        let fileContent = file.readString(FILE_PATH).trim();
        if (fileContent) {
            existingData = JSON.parse(fileContent);
            if (!Array.isArray(existingData)) existingData = [];
        }
    } catch (error) {
        console.warn("⚠️ No existing credentials found, creating a new file.");
        existingData = [];
    }

    // ✅ Append new credentials and write back
    existingData.push({ credentialsId });

    try {
        file.appendString(FILE_PATH, JSON.stringify(existingData, null, 2) + "\n"); 
        console.log(`✅ Credentials saved: ${credentialsId}`);
    } catch (error) {
        console.error("❌ Error writing credentials to file!", error);
    }
}

// ✅ Function: Register a New User
function registerUser() {
    let email = `test-${randomString(5)}-${randomIntBetween(100, 1000)}@yopmail.com`;
    console.log(`📧 Registering user: ${email}`);

    let payload = JSON.stringify({
        email: email,
        firstName: `firstName-${randomString(5)}`,
        lastName: `lastName-${randomString(5)}`,
        password: PASSWORD,
        phone: '12345678'
    });

    let headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    let res = http.post(`${BASE_URL}/noauth/signup`, payload, { headers });

    if (!check(res, { '✅ Signup Successful': (r) => r.status === 200 })) {
        console.error(`❌ Signup failed for ${email}: `, res.status, res.body);
        return null;
    }

    console.log(`✅ User Registered: ${email}`);
    return email;
}

// ✅ Function: Verify User Email
function verifyUser(email) {
    console.log(`🔍 Verifying email: ${email}`);

    let payload = JSON.stringify({ email: email, otpCode: VERIFICATION_CODE });
    let headers = { 'Content-Type': 'application/json' };
    let res = http.post(`${BASE_URL}/noauth/autoLoginByEmail`, payload, { headers });

    if (!check(res, { '✅ Verification Successful': (r) => r.status === 200 })) {
        console.error(`❌ Verification failed for ${email}: `, res.status, res.body);
        return null;
    }

    console.log(`✅ Verification Successful: ${email}`);
    return res.json().token;
}

// ✅ Function: Create a Device
function createDevice(token) {
    console.log(`🛠 Creating device...`);

    let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    let payload = JSON.stringify({ "name": `device-${randomString(5)}`, "label": "Test Device", "additionalInfo": {} });

    let res = http.post(`${BASE_URL}/device`, payload, { headers });
    if (!res.json().id?.id) {
        console.error("❌ Failed to create device", res.status, res.body);
        return null;
    }

    console.log(`✅ Device Created: ${res.json().id.id}`);
    return res.json().id.id;
}

// ✅ Function: Fetch Device Credentials and Save
function getDeviceCredentials(deviceId, token) {
    console.log(`🔑 Fetching credentials for device: ${deviceId}`);

    let headers = { 'Authorization': `Bearer ${token}` };
    let res = http.get(`${BASE_URL}/device/${deviceId}/credentials`, { headers });

    let credentialsId = res.json()?.credentialsId || null;
    if (!credentialsId) {
        console.error(`❌ Failed to fetch credentials for device: ${deviceId}`);
        return null;
    }

    console.log(`✅ Credentials Retrieved: ${credentialsId}`);
    saveCredentialsToFile(credentialsId);
    return credentialsId;
}

// ✅ Main Function: Full Flow (Register → Verify → Login → Create Device → Store in File)
export default function () {
    console.log(`🚀 Starting execution for VU: ${__VU}, Iteration: ${__ITER}`);

    let email = registerUser();
    if (!email) return;

    sleep(5); // Wait before verification

    let token = verifyUser(email);
    if (!token) return;

    sleep(2);

    let deviceId = createDevice(token);
    if (!deviceId) return;

    getDeviceCredentials(deviceId, token);

    sleep(2);
}

// ✅ Teardown: Logging Completion
export function teardown() {
    console.log("✅ Test execution completed.");
}
