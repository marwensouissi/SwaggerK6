import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// ✅ Custom Metrics
const responseTimeOver200ms = new Rate('response_time_over_200ms'); // Tracks % of requests > 200ms
const successRate = new Rate('success_rate'); // Tracks % of successful (status 200) requests

// ✅ K6 Test Options
export const options = {
    vus: 2,  
    duration: '10s',
};

// ✅ Function to Perform the Test Request
function performRequest() {
    const res = http.get('https://dev-itona.xyz/');

    // ✅ Status Check
    const isStatus200 = res.status === 200;
    successRate.add(isStatus200);

    // ✅ Response Time Check (>200ms)
    const isSlow = res.timings.duration > 200;
    responseTimeOver200ms.add(isSlow);

    check(res, {
        '✅ Status is 200': () => isStatus200,
        '⏳ Response time > 200ms': () => isSlow,
    });
    

    return res;
}

// ✅ Main Execution Function
export default function () {
    performRequest();
    sleep(1); // Simulates real-user behavior
}
