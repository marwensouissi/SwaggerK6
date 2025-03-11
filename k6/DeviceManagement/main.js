import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************/
    const token = login("marwen.souissi00@gmail.com", "marwen123");


    //*************  POST CREATE DEVICE *********************/
    const post_metadata_device = {
        url: `${BASE_URL}/device`,
        payload: {
            "name": `device-${randomString(5)}`,
            "label": "Test Device",
            "additionalInfo": {
                "gateway": false,
                "overwriteActivityTime": false,
                "description": ""
            }
        },
        tag: "device",
        job: "Create a new device",
        status: 200, // API usually returns 201 for new resource creation
        token: token,
    };

    const post_device_result = post_abstract_with_payload(post_metadata_device);

    const deviceId = post_device_result.data.id.id;
    sleep(0.5);

    //************* FETCH DEVICE CREDENTIALS *********************/
    const get_device_credentials = {
        url: `${BASE_URL}/device/${deviceId}/credentials`,
        tag: "device",
        job: "Fetch device credentials",
        fail: false,
        token: token,
    };

    const device_data = get_abstract_with_payload(get_device_credentials);
    const credentialsId = device_data.data.credentialsId;

    sleep(0.5);

    //************* UPDATE DEVICE (PUT REQUEST) *********************/

}