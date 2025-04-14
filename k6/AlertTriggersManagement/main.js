import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE or COPY Trigger (POST request) *********************//
    const post_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            operationName: "InsertTrigger",
            query: "mutation InsertTrigger($name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {\n  insert_trigger(\n    objects: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}\n  ) {\n    affected_rows\n    returning {\n      alarmSeverities\n      alarmTypes\n      description\n      notifyOn\n      name\n      uuid\n      __typename\n    }\n    __typename\n  }\n}",
            variables: {
                alarmSeverities: "[\"MINOR\"]",
                alarmTypes: "[\"tessst\"]",
                description: `description-${randomString(8)}`,
                name: `trigger-${randomString(8)}`,
                notifyOn: "[\"CREATED\",\"SEVERITY_CHANGED\",\"ACKNOWLEDGED\",\"CLEARED\"]"
            }
        },
        tag: "test",
        job: "user creates or copy a trigger",
        fail: false,
        status: 200,
        token: token,
    };
    const post_trigger_response = post_abstract_with_payload(post_metadata_trigger);
    console.log("create/copy trigger response: ", post_trigger_response); 

    const triggerUUID = post_trigger_response?.data?.data?.insert_trigger?.returning[0]?.uuid; // Extract the UUID from the response
    console.log("Trigger UUID: ", triggerUUID); // Log the UUID
    sleep(0.5);

    //*************  EDIT Trigger (POST request) *********************//
    const edit_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            operationName: "UpdateTrigger",
            query: "mutation UpdateTrigger($uuid: uuid!, $name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {\n  update_trigger(\n    where: {uuid: {_eq: $uuid}}\n    _set: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}\n  ) {\n    affected_rows\n    returning {\n      uuid\n      name\n      alarmSeverities\n      alarmTypes\n      notifyOn\n      description\n      __typename\n    }\n    __typename\n  }\n}",
            variables: {
                alarmSeverities: "[\"WARNING\"]",
                alarmTypes: "[\"test\"]",
                description: "test",
                name: `edited-${randomString(8)}`,
                notifyOn: "[\"CREATED\",\"SEVERITY_CHANGED\",\"ACKNOWLEDGED\",\"CLEARED\"]",
                uuid: triggerUUID 
            }
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

    /* **********************  DELETE Trigger  *********************/
    const delete_trigger = {
        url: "https://dev-itona.xyz/graph/v1/graphql",
        payload: {
            operationName: "DeleteTrigger",
            query: "mutation DeleteTrigger($uuid: uuid!) { delete_trigger(where: {uuid: {_eq: $uuid}}) { affected_rows returning { uuid __typename } __typename } }",
            variables: {
                uuid: triggerUUID, // Use the extracted UUID
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