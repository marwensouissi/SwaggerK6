import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //
    const token = login("henchirnouha02@gmail.com", "123456789");

    //*************  CREATE Trigger (POST request) *********************//
    const post_metadata_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: JSON.stringify({
            operationName: "InsertTrigger",
            query: `mutation InsertTrigger($name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {
                insert_trigger(objects: {
                    name: $name, 
                    alarmSeverities: $alarmSeverities, 
                    alarmTypes: $alarmTypes, 
                    notifyOn: $notifyOn, 
                    description: $description
                }) {
                    affected_rows
                    returning {
                        alarmSeverities
                        alarmTypes
                        description
                        notifyOn
                        name
                        uuid
                    }
                }
            }`,
            variables: {
                name: "testtt",
                alarmSeverities: "[\"MINOR\"]",
                alarmTypes: "[\"testtt\"]",
                notifyOn: "ALARM",
                description: "test description"
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        tag: "test",
        job: "user creates a trigger",
        fail: false,
        status: 200,
        token: token,
    };
    const post_trigger_result = post_abstract_with_payload(post_metadata_trigger);
    console.log(post_trigger_result); // Journaliser la réponse
    sleep(0.5);

    // *********************     COPY Trigger (POST request)  *********************// 
    const post_copy_trigger = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: JSON.stringify({
            operationName: "InsertTrigger",
            query: "mutation InsertTrigger($name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {\n  insert_trigger(\n    objects: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}\n  ) {\n    affected_rows\n    returning {\n      alarmSeverities\n      alarmTypes\n      description\n      notifyOn\n      name\n      uuid\n      __typename\n    }\n    __typename\n  }\n}",
            variables: {
                name: "testtt (Copy) (Copy) ffff",
                alarmSeverities: "[\"MINOR\"]",
                alarmTypes: "[\"testtt\"]",
                description: "tesssssst ccopy",
                notifyOn: "[\"CREATED\",\"SEVERITY_CHANGED\",\"ACKNOWLEDGED\",\"CLEARED\"]"
            }
        }),
        tag: "test",
        job: "copy a trigger",
        fail: false,
        status: 200,
        token: token,
        };
    const post_copy_trigger_result = post_abstract_with_payload(post_copy_trigger);
    console.log(post_copy_trigger_result); // Journaliser la réponse
    sleep(0.5);
    
    // *********************  DELETE Trigger  *********************// 
    const delete_trigger = {
        url: "https://dev-itona.xyz/graph/v1/graphql",
        payload: JSON.stringify({
            operationName: "DeleteTrigger",
            query: "mutation DeleteTrigger($uuid: uuid!) { delete_trigger(where: {uuid: {_eq: $uuid}}) { affected_rows returning { uuid __typename } __typename } }",
            variables: {
                uuid: "edfe10c1-cba9-49b6-a974-a11723a4dc8c"
            }
        }),
        tag: "delete_trigger",
        job: "Delete a trigger",
        fail: false,
        status: 200,
        token: token,
        };
    const delete_trigger_result = post_abstract_with_payload(delete_trigger);
    console.log(delete_trigger_result); // Journaliser la réponse
    sleep(0.5);
    
    sleep(1);

}