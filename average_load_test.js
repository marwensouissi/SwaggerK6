import http from 'k6/http';
import { check, sleep } from 'k6';

// ✅ Custom Metrics
let responseTimeOver200ms = new Rate('response_time_over_200ms'); // Track % of requests > 200ms
let successRate = new Rate('success_rate'); // Track % of requests with status 200

export let options = {
    vus: 10,  // Typical traffic load
    duration: '1m',
};

export default function () {
    let res = http.get('https://dev-itona.xyz/');
    
    check(res, { 'status is 200': (r) => r.status === 200 });

    sleep(1);
}
