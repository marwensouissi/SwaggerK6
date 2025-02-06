import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// ✅ Custom Metrics
const responseTimeOver200ms = new Rate('response_time_over_200ms'); // % of slow requests
const successRate = new Rate('success_rate'); // % of successful requests

// ✅ Test Configuration (Soak Test)
export let options = {
    vus: 8,         // Moderate users over time
    duration: '5m', // Sustained load for 5 minutes
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
    