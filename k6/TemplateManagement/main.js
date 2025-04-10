import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE Template (POST request) *********************//
    const post_metadata_template = {
        url: `${BASE_URL}/notification/template`,
        payload: {
            "name": randomString(10), // Génère un nom aléatoire 
            "notificationType": "ALARM",
            "configuration": {
                "selectedMethod": "WEB",
                "deliveryMethodsTemplates": {
                    "WEB": {
                        "subject": randomString(15), // Génère un sujet aléatoire 
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
        job: "user creates a template",
        fail: false,
        status: 200,
        token: token,
    };
    const post_template_result = post_abstract_with_payload(post_metadata_template);
    console.log("create template : ",post_template_result); // Journaliser la réponse
  
    // Declare templateID 
    const templateID = post_template_result.data.id.id;
    console.log("Template ID: ", templateID); // Log the template ID for further use
    sleep(0.5);

    // *********************     COPY Template (POST request)  *********************// 
    const post_copy_template = {
        url: `${BASE_URL}/notification/template`,
        payload: {
            "name": `${randomString(10)} - copy`, // Generate a unique name for the copied template
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
        job: "copy a template",
        fail: false,
        status: 200,
        token: token,
    };
    const post_copy_template_response = post_abstract_with_payload(post_copy_template);
    console.log("copy template : ",post_copy_template_response); // Journaliser la réponse
    sleep(0.5);

    //*********************************** DELETE Template *************************************//
    const delete_template = {
        url: `${BASE_URL}/notification/template/${templateID}`,
        tag: "test",
        job: "delete a template",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_template_result = delete_abstract_without_payload(delete_template);
    console.log("delete template : ",delete_template_result); // Journaliser la réponse
    sleep(0.5);

    sleep(1);




}