import http from 'k6/http';
import { check, sleep } from 'k6';
import file from 'k6/x/file';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// ✅ Configuration
const BASE_URL = 'https://dev-itona.xyz/api';
const VERIFICATION_CODE = '123456';
const PASSWORD = '123123';
const FILE_PATH = "device_credentials.json";

// ✅ K6 Load Options
export let options = {
    vus: 3,       // Simulate 3 virtual users
    iterations: 3 // Each VU runs 3 times
};

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

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    let res = http.post(`${BASE_URL}/noauth/signup`, payload, { headers });

    let success = check(res, { '✅ Signup Successful': (r) => r.status === 200 });

    if (!success) {
        console.error(`❌ Signup failed for ${email}: `, res.status, res.body);
        return null;
    }

    console.log(`✅ User Registered: ${email}`);
    return email;
}

// ✅ Function: Verify User Email
function verifyUser(email) {
    console.log(`🔍 Verifying email: ${email}`);

    let payload = JSON.stringify({
        email: email,
        otpCode: VERIFICATION_CODE
    });

    let headers = {
        'Content-Type': 'application/json'
    };

    let res = http.post(`${BASE_URL}/noauth/autoLoginByEmail`, payload, { headers });

    let success = check(res, { '✅ Verification Successful': (r) => r.status === 200 });

    if (!success) {
        console.error(`❌ Verification failed for ${email}: `, res.status, res.body);
        return null;
    }

    console.log(`✅ Verification Successful: ${email}`);
    return res.json().token;  // Return token if successful
}

// ✅ Function: Create a Device
function createDevice(token) {
    console.log(`🛠 Creating device...`);

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let payload = JSON.stringify({
        "name": `device-${randomString(5)}`,
        "label": "Test Device",
        "additionalInfo": {}
    });

    let res = http.post(`${BASE_URL}/device`, payload, { headers });

    if (!res.json().id?.id) {
        console.error("❌ Failed to create device", res.status, res.body);
        return null;
    }

    console.log(`✅ Device Created: ${res.json().id.id}`);
    return res.json().id.id;
}

// ✅ Function: Fetch Device Credentials and Write to File
function getDeviceCredentials(deviceId, token) {
    console.log(`🔑 Fetching credentials for device: ${deviceId}`);

    let headers = {
        'Authorization': `Bearer ${token}`
    };

    let res = http.get(`${BASE_URL}/device/${deviceId}/credentials`, { headers });

    let credentialsId = res.json()?.credentialsId || null;
    if (!credentialsId) {
        console.error(`❌ Failed to fetch credentials for device: ${deviceId}`);
        return null;
    }

    console.log(`✅ Credentials Retrieved: ${credentialsId}`);

    // ✅ Store credentials in file (append mode)
    appendCredentialsToFile(credentialsId);

    return credentialsId;
}

// ✅ Function: Append `credentialsId` to File Without Overwriting
function appendCredentialsToFile(credentialsId) {
    let existingData = [];

    // ✅ Read existing credentials before writing
    try {
        let fileContent = file.readString(FILE_PATH);
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) {
            existingData = [];
        }
    } catch (error) {
        console.warn("⚠️ No existing credentials found, creating a new file.");
    }

    // ✅ Append new credentials while keeping previous ones
    existingData.push({ credentialsId });

    // ✅ Save updated data back to the file
    try {
        file.appendString(FILE_PATH, JSON.stringify(existingData, null, 2));
        console.log(`✅ Credentials saved: ${credentialsId}`);
    } catch (error) {
        console.error("❌ Error writing credentials to file!", error);
    }
}

// ✅ Function: Append `credentialsId` to File Without Overwriting
function appendCredentialsToFile(credentialsId) {
    let existingData = [];

    // ✅ Step 1: Read existing file data
    try {
        let fileContent = file.readString(FILE_PATH).trim();
        if (fileContent) { // Ensure the file is not empty
            existingData = JSON.parse(fileContent);
            if (!Array.isArray(existingData)) {
                existingData = []; // Reset if data is not an array
            }
        }
    } catch (error) {
        console.warn("⚠️ No existing credentials found, creating a new file.");
        existingData = [];
    }

    // ✅ Step 2: Append the new `credentialsId`
    existingData.push({ credentialsId });

    // ✅ Step 3: Convert the updated array into JSON string
    let jsonData = JSON.stringify(existingData, null, 2);

    // ✅ Step 4: Clear the file first, then append properly formatted JSON
    try {
        file.appendString(FILE_PATH, jsonData + "\n");  // Overwrite but keep old data
        console.log(`✅ Credentials saved: ${credentialsId}`);
    } catch (error) {
        console.error("❌ Error writing credentials to file!", error);
    }
}



// ✅ Default Function: Full Flow (Register → Verify → Login → Create Device → Store in File)
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
