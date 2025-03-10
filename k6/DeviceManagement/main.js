import http from 'k6/http';
import { check, sleep } from 'k6';

import { get_abstract_with_payload, post_abstract_with_payload } from '../../utils/abstract.js';
import { login } from '../../utils/login.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';
    const CREDENTIALS = {
        username: "marwen.souissi00@gmail.com",
        password: "marwen123"
    };


    // ************* Login *********************/

    let payload = JSON.stringify(CREDENTIALS);
    let headers = { 'Content-Type': 'application/json' };
    let res = http.post(`${BASE_URL}/auth/login`, payload, { headers });
    const token = res.json('token');
    console


    //************* POST *********************/

    // Function to create a device
    const post_metadata_device = {
        url: `${BASE_URL}/device`,
        payload: {
            "name": `device-${randomString(5)}`,
            "label": "Test Device",
            "additionalInfo": {}
        },
        tag: "device",
        job: "Create a new device",
        fail: false,
        status: 201,
        token: token,
    };

    const post_device_data = post_abstract_with_payload(post_metadata_device);
    const deviceId = post_device_data.id.id;
    sleep(0.5);

    // Function to fetch device credentials
    const get_device_credentials = {
        url: `${BASE_URL}/device/${deviceId}/credentials`,
        tag: "device",
        job: "Fetch device credentials",
        fail: false,
        token: token,
    };

    const credentials = get_abstract_with_payload(get_device_credentials);
    sleep(0.5);
}