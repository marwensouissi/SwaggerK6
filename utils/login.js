import http from 'k6/http';
import { check } from 'k6';

// Login function that authenticates a user and returns a token
export function login(metadata) {
    const payload = JSON.stringify({
        username: metadata.email, // Use 'username' instead of 'email'
        password: metadata.password
    });

    const headers = { 'Content-Type': 'application/json' };

    console.log('🔹 Sending login request to:', metadata.url);
    console.log('🔹 Payload:', payload);

    const response = http.post(metadata.url, payload, { 
        headers: headers,
    });

    console.log('🔹 Response status:', response.status);
    console.log('🔹 Response body:', response.body);

    // Check if login was successful (status 200 and token exists)
    const success = check(response, {
        'Login status is 200': (r) => r.status === 200,
        'Token received': (r) => r.json('token') !== undefined,
    });

    if (!success) {
        console.error('❌ Login failed! Response:', response.body);
        return null;
    }

    const token = response.json('token');
    console.log('🔹 Login successful, token received');
    return token;
}