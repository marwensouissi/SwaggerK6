import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// ✅ Custom Metrics
let responseTimeOver200ms = new Rate('response_time_over_200ms'); // Track % of requests > 200ms
let successRate = new Rate('success_rate'); // Track % of requests with status 200

export let options = {
    stages: [
        { duration: '10s', target: 5 },   // Start with 5 users
        { duration: '10s', target: 10 },  // Increase to 10 users
        { duration: '10s', target: 15 },  // Increase to 15 users
        { duration: '10s', target: 20 },  // Increase to 20 users
        { duration: '10s', target: 25 },  // Pushing the limit
        { duration: '10s', target: 30 },  // Finding the breaking point
    ],
    thresholds: {
        'http_req_duration': ['p(95)<1000'], // 95% of requests should be under 1000ms
        'http_req_failed': ['rate<0.05'],    // Fail rate should be less than 5%
    }
};

export default function () {
    let res = http.get('https://dev-itona.xyz/');

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

    sleep(1);
}
