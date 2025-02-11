import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// ✅ Custom Metrics
const responseTimeOver200ms = new Rate('response_time_over_200ms');
const successRate = new Rate('success_rate');

// ✅ Test Configuration
export let options = {
    stages: [
        { duration: '10s', target: 20 },  // Sudden spike to 20 users
        { duration: '20s', target: 5 },   // Drop to 5 users
        { duration: '10s', target: 25 },  // Another sudden spike to 25 users
        { duration: '20s', target: 5 },   // Drop to 5 users again
    ],
};

// ✅ Function to Perform Request & Check Responses
function testEndpoint(url) {
    const res = http.get(url);

    const isStatus200 = res.status === 200;
    const isSlow = res.timings.duration > 200;

    successRate.add(isStatus200);
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
