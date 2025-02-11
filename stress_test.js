import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// ✅ Custom Metrics
let responseTimeOver200ms = new Rate('response_time_over_200ms'); // Track % of requests > 200ms
let successRate = new Rate('success_rate'); // Track % of requests with status 200

// ✅ Load Test Configuration (Expected Traffic)
export let options = {
    stages: [
        { duration: '10s', target: 5 },  // Gradual increase to 5 users
        { duration: '10s', target: 10 }, // Increase to 10 users
        { duration: '10s', target: 15 }, // Increase to 15 users
        { duration: '10s', target: 20 }, // Peak 20 users
    ],
};

// ✅ Function to Test API Endpoint
function testEndpoint(url) {
    const res = http.get(url);

    // ✅ Status Check
    let isStatus200 = res.status === 200;
    successRate.add(isStatus200);

    // ✅ Response Time Check (>200ms)
    let isSlow = res.timings.duration > 200;
    responseTimeOver200ms.add(isSlow);

    check(res, {
        '✅ Status is 200': () => isStatus200,
        '⏳ Response time > 200ms': () => isSlow,
    });

    return res;
}

// ✅ Main Execution
export default function () {
    testEndpoint('https://dev-itona.xyz/');
    sleep(1);
}
