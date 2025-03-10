import http from 'k6/http';
import { check } from 'k6';

// Login function that authenticates a user and returns a token
export function login(metadata) {
    const payload = JSON.stringify({
        email: metadata.email,
        password: metadata.password // Note: Your workflow uses 'pass' instead of 'password'
    });

    const headers = {
        'Content-Type': 'application/json'
    };

    const response = http.post(metadata.url, payload, { 
        headers,
        tags: {
            name: metadata.tag,
            job: metadata.job
        }
    });

    // Check if login was successful (status 200 and token exists)
    const success = check(response, {
        [`${metadata.job} - status is 200`]: (r) => r.status === 200,
        [`${metadata.job} - token received`]: (r) => r.json('token') !== undefined
    });

    if (!success && !metadata.fail) {
        console.error(`❌ ${metadata.job} failed for ${metadata.email}: ${response.status} - ${response.body}`);
        return null;
    }

    const token = response.json('token');
    if (token && !metadata.fail) {
        console.log(`🔹 ${metadata.job} succeeded for ${metadata.email}: Token = ${token}`);
    }

    return token;
}