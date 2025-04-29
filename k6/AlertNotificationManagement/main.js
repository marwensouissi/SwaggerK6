import http from 'k6/http';
import { check, sleep } from 'k6';
import { post_abstract_with_payload, delete_abstract_without_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'https://dev-itona.xyz/api';

// ************* CREATE workflow (POST request) *********************//
export function create_workflow(token) {
    var post_metadata_notification = {
        url: BASE_URL + '/notification/rule',
        payload: {
            "name": randomString(15),
            "templateId": {
                "entityType": "NOTIFICATION_TEMPLATE",
                "id": "d910e900-034b-11f0-8799-838a2f0b0690"
            },
            "triggerType": "ALARM",
            "triggerTypeObject": "67e579ec-2d75-4b88-82e7-94a5f6f618ef",
            "recipientsConfig": {
                "escalationTable": {
                    "0": ["eec73f60-0bca-11f0-988a-cfdcd328c9b8"]
                },
                "triggerType": "ALARM"
            },
            "triggerConfig": {
                "alarmTypes": ["tessssssssssssssssssssssst"],
                "alarmSeverities": ["WARNING"],
                "clearRule": {
                    "alarmStatuses": ["ACK"]
                },
                "notifyOn": ["CREATED", "SEVERITY_CHANGED", "ACKNOWLEDGED", "CLEARED"],
                "triggerType": "ALARM"
            },
            "additionalConfig": {
                "description": randomString(15),
                "triggerId": "67e579ec-2d75-4b88-82e7-94a5f6f618ef",
                "triggerName": "tessssssssssssssssst"
            }
        },
        tag: "test",
        job: "user creates or copies a workflow",
        fail: false,
        status: 200,
        token: token,
    };

    var response = post_abstract_with_payload(post_metadata_notification);
    console.log("create workflow :", response);
    
    var notifID = null;
    if (response && response.data && response.data.id) {
        notifID = response.data.id.id;
    }
    console.log("Notification ID: " + notifID);
    sleep(0.5);
    return notifID;
}


// ************* EDIT workflow *********************//
export function edit_workflow(token, notifID) {
    const edit_metadata_notification = {
        url: `${BASE_URL}/notification/rule`,
        payload: {
            "id": {
                "entityType": "NOTIFICATION_RULE",
                "id": notifID
            },
            "name": `edited-${randomString(8)}`,
            "templateId": {
                "entityType": "NOTIFICATION_TEMPLATE",
                "id": "d910e900-034b-11f0-8799-838a2f0b0690"
            },
            "triggerType": "ALARM",
            "triggerTypeObject": "67e579ec-2d75-4b88-82e7-94a5f6f618ef",
            "recipientsConfig": {
                "escalationTable": {
                    "0": ["eec73f60-0bca-11f0-988a-cfdcd328c9b8"]
                },
                "triggerType": "ALARM"
            },
            "triggerConfig": {
                "alarmTypes": ["tessssssssssssssssssssssst"],
                "alarmSeverities": ["WARNING"],
                "clearRule": {
                    "alarmStatuses": ["ACK"]
                },
                "notifyOn": ["CREATED", "SEVERITY_CHANGED", "ACKNOWLEDGED", "CLEARED"],
                "triggerType": "ALARM"
            },
            "additionalConfig": {
                "description": randomString(15),
                "triggerId": notifID,
                "triggerName": randomString(15)
            }
        },
        tag: "test",
        job: "user edits a workflow",
        fail: false,
        status: 200,
        token: token,
    };

    const response = post_abstract_with_payload(edit_metadata_notification);
    console.log("edit workflow :", response);
    sleep(0.5);
}

// ************* DELETE workflow *********************//
export function delete_workflow(token, notifID) {
    const delete_metadata_notification = {
        url: `${BASE_URL}/notification/rule/${notifID}`,
        tag: "test",
        job: "user deletes a workflow",
        fail: false,
        status: 200,
        token: token,
    };

    const response = delete_abstract_without_payload(delete_metadata_notification);
    console.log("delete workflow :", response);
    sleep(0.5);
}
