import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* GET Notification List (GET request) *********************//
    const get_metadata_notification_list = {
        url: `${BASE_URL}/notifications?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC&unreadOnly=true`,
        payload: {
            "pageSize": 10,
            "page": 0,
            "sortProperty": "createdTime",
            "sortOrder": "DESC",
            "unreadOnly": true
        },
        tag: "test",
        job: "user fetches a notification list",
        fail: false,
        status: 200,
        token: token,
    };
    const get_notification_list_response = get_abstract_with_payload(get_metadata_notification_list);
    console.log(get_notification_list_response); 
    sleep(0.5);
}