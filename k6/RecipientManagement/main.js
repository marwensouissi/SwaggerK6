import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE Recipient (POST request) *********************//
    const post_metadata_recipient = {
        url: `${BASE_URL}/notification/target`,
        payload: {
            "name": `test-${randomString(10)}`, // Ensure the name is unique,
            "configuration": {
              "type": "PLATFORM_USERS",
              "description": "testt",
              "usersFilter": {
                "type": "USER_LIST",
                "usersIds": ["aee340d0-ef6c-11ef-a2cf-8be4056be751"]
              }
            }
          },
        tag: "test",
        job: "user creates a recipient",
        fail: false,
        status: 200,
        token: token,
    };
    const post_recipient_result = post_abstract_with_payload(post_metadata_recipient);
    console.log(post_recipient_result); // Journaliser la réponse
    sleep(0.5);



    














}