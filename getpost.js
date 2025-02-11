import http from 'k6/http';
import { check, sleep } from 'k6';

// ✅ Configurations
const BASE_URL = 'https://dev-itona.xyz/api';
const CREDENTIALS = {
    username: "marwen.souissi00@gmail.com",
    password: "marwen123"
};

// ✅ k6 Test Options
export let options = {
    vus: 10,
    duration: '10s',
};

// 📌 Function to Perform Login and Return Token
function login() {
    let payload = JSON.stringify(CREDENTIALS);
    let headers = { 'Content-Type': 'application/json' };

    let res = http.post(`${BASE_URL}/auth/login`, payload, { headers });

    let success = check(res, {
        '✅ Login Successful': (r) => r.status === 200 && r.json('token') !== undefined,
    });

    if (!success) {
        console.error('❌ Login Failed! Response:', res.body);
        return null;
    }

    let token = res.json('token');
    console.log('🔹 Token received:');
    return token;
}

// 📌 Function to Fetch Authenticated User Data
function getUser(token) {
    let headers = { 'Authorization': `Bearer ${token}` };
    let res = http.get(`${BASE_URL}/auth/user`, { headers });

    check(res, {
        '✅ Authenticated User Data Retrieved': (r) => r.status === 200,
    });

    if (res.status !== 200) {
        console.error('❌ Failed to retrieve user data. Response:', res.body);
    }
}

// 📌 Function to Logout
function logout(token) {
    let headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let res = http.post(`${BASE_URL}/auth/logout`, null, { headers });

    check(res, {
        '✅ Logout Successful': (r) => r.status === 200,
    });

    if (res.status !== 200) {
        console.error('❌ Logout Failed! Response:', res.body);
    } else {
        console.log('🔹 Successfully logged out.');
    }
}

// ✅ Main k6 Execution Function
export default function () {
    let token = login();

    if (token) {
        getUser(token);
        logout(token);
    }

    sleep(1);
}
