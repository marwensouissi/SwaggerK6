import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE or COPY Template (POST request) *********************//
    const post_metadata_template = {
        url: `${BASE_URL}/notification/template`,
        payload: {
            "name": randomString(10), 
            "notificationType": "ALARM",
            "configuration": {
                "selectedMethod": "WEB",
                "deliveryMethodsTemplates": {
                    "WEB": {
                        "subject": randomString(15),  
                        "body": randomString(20), 
                        "method": "WEB"
                    },
                    "MOBILE_APP": {
                        "subject": randomString(15), 
                        "body": randomString(20), 
                        "method": "MOBILE_APP"
                    }
                }
            }
        },
        tag: "test",
        job: "user creates or copy a template",
        fail: false,
        status: 200,
        token: token,
    };
    const post_template_result = post_abstract_with_payload(post_metadata_template);
    console.log("create template : ",post_template_result);  
    const templateID = post_template_result.data.id.id; // Extract the template ID from the response
    console.log("Template ID: ", templateID); // Log the template ID 
    sleep(0.5);

    sleep(1);




}