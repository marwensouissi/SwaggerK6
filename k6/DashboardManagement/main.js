import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************/
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  POST CREATE Dashboard *********************/
    const post_metadata_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "title": "Test Dashboard",
            "image": null,
            "additionalInfo": {},
            "configuration": {},
        },
        tag: "test",
        job: "user creates a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const post_dashboard_result = post_abstract_with_payload(post_metadata_dashboard);
    console.log(post_dashboard_result); // Journaliser la réponse
    
    const dashId = post_dashboard_result.data.id.id;
    sleep(0.5);

    /*############     POST (Update)     ############*/
    const update_metadata_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "id": { "entityType": "DASHBOARD", "id": dashId },
            "title": "Updated Test Dashboard",
            "image": null,
            "additionalInfo": {},
            "configuration": {},
        },
        tag: "test",
        job: "user updates the dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const update_response = post_abstract_with_payload(update_metadata_dashboard);
    console.log(update_response); // Journaliser la réponse
    sleep(0.2);
    
    sleep(1);
}
