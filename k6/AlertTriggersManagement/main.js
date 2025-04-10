import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE Trigger (POST request) *********************//
    const post_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
                name: `${randomString(8)}`,
                alarmSeverities: (["WARNING"]),
                alarmTypes: (["zsedrtfgyhujiokpl"]),
                description: `description-${randomString(8)}`,
                notifyOn: (["CREATED", "SEVERITY_CHANGED", "ACKNOWLEDGED", "CLEARED"]),
                operationName: "InsertTrigger",
                query: "mutation InsertTrigger($name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {\n  insert_trigger(\n    objects: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}\n  ) {\n    affected_rows\n    returning {\n      alarmSeverities\n      alarmTypes\n      description\n      notifyOn\n      name\n      uuid\n      __typename\n    }\n    __typename\n  }\n}"

            },
        tag: "test",
        job: "user creates a trigger",
        fail: false,
        status: 200,
        token: token,
    };
    const post_trigger_response = post_abstract_with_payload(post_metadata_trigger);
    console.log("create trigger response: ", post_trigger_response); // Log the full response

    sleep(0.5);

    //*************  EDIT Trigger (POST request) *********************//
    const edit_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
                name: `${randomString(8)}`,
                uuid: "3677e1f9-f6fb-4d61-887e-518840979a3b",
                alarmSeverities: (["WARNING"]),
                alarmTypes: (["zsedrtfgyhujiokpl"]),
                description: `description-${randomString(8)}`,
                notifyOn: (["CREATED", "SEVERITY_CHANGED", "ACKNOWLEDGED", "CLEARED"])
            },
        tag: "test",
        job: "user edits a trigger",
        fail: false,
        status: 200,
        token: token,
    };
    const edit_trigger_response = post_abstract_with_payload(edit_metadata_trigger);
    console.log("edit trigger: ",edit_trigger_response); // Journaliser la réponse
    sleep(0.5);

    // *********************  COPY Trigger (POST request)  *********************// 
    const copy_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            name: `copy-${randomString(8)}`,
            alarmSeverities: (["WARNING"]),
            alarmTypes: (["zsedrtfgyhujiokpl"]),
            description: `copy-${randomString(8)}`,
            notifyOn: (["CREATED", "SEVERITY_CHANGED", "ACKNOWLEDGED", "CLEARED"])
        },
        tag: "test",
        job: "copy a trigger",
        fail: false,
        status: 200,
        token: token,
        };
    const copy_trigger_response = post_abstract_with_payload(copy_metadata_trigger);
    console.log("copy trigger : ",copy_trigger_response); // Journaliser la réponse
    sleep(0.5);
    
    /* **********************  DELETE Trigger  *********************/
    const delete_trigger = {
        url: "https://dev-itona.xyz/graph/v1/graphql",
        payload: {
            operationName: "DeleteTrigger",
            query: "mutation DeleteTrigger($uuid: uuid!) { delete_trigger(where: {uuid: {_eq: $uuid}}) { affected_rows returning { uuid __typename } __typename } }",
            variables: {
                uuid: "edfe10c1-cba9-49b6-a974-a11723a4dc8c"
            }
        },
        tag: "test",
        job: "user deletes a trigger",
        fail: false,
        status: 200,
        token: token,
        };
    const delete_trigger_response = post_abstract_with_payload(delete_trigger);
    console.log("delete trigger : ",delete_trigger_response); // Journaliser la réponse
    sleep(0.5); 
    
    sleep(1);

}