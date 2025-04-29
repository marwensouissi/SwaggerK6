import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { post_abstract_with_payload } from '../utils/abstract.js';

const GRAPHQL_URL = 'https://dev-itona.xyz/graph/v1/graphql';

// ************* CREATE Trigger ********************* //
export function create_trigger(token) {
    const post_metadata_trigger = {
        url: GRAPHQL_URL,
        payload: {
            operationName: "InsertTrigger",
            query: `mutation InsertTrigger($name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {
  insert_trigger(
    objects: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}
  ) {
    affected_rows
    returning {
      uuid
    }
  }
}`,
            variables: {
                alarmSeverities: "[\"MINOR\"]",
                alarmTypes: "[\"tessst\"]",
                description: `description-${randomString(8)}`,
                name: `trigger-${randomString(8)}`,
                notifyOn: "[\"CREATED\",\"SEVERITY_CHANGED\",\"ACKNOWLEDGED\",\"CLEARED\"]"
            }
        },
        tag: "test",
        job: "user creates a trigger",
        fail: false,
        status: 200,
        token: token,
    };

    const response = post_abstract_with_payload(post_metadata_trigger);
    console.log("create trigger response:", response);
    let triggerUUID = null;
    if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.insert_trigger &&
        response.data.data.insert_trigger.returning &&
        response.data.data.insert_trigger.returning.length > 0
    ) {
        triggerUUID = response.data.data.insert_trigger.returning[0].uuid;
    }
        console.log("Trigger UUID:", triggerUUID);
    return triggerUUID;
}

// ************* EDIT Trigger ********************* //
export function edit_trigger(token, triggerUUID) {
    const edit_metadata_trigger = {
        url: GRAPHQL_URL,
        payload: {
            operationName: "UpdateTrigger",
            query: `mutation UpdateTrigger($uuid: uuid!, $name: String, $alarmSeverities: String, $alarmTypes: String, $notifyOn: String, $description: String) {
  update_trigger(
    where: {uuid: {_eq: $uuid}},
    _set: {name: $name, alarmSeverities: $alarmSeverities, alarmTypes: $alarmTypes, notifyOn: $notifyOn, description: $description}
  ) {
    affected_rows
    returning {
      uuid
    }
  }
}`,
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

    const response = post_abstract_with_payload(edit_metadata_trigger);
    console.log("edit trigger response:", response);
}

// ************* DELETE Trigger ********************* //
export function delete_trigger(token, triggerUUID) {
    const delete_payload = {
        url: GRAPHQL_URL,
        payload: {
            operationName: "DeleteTrigger",
            query: `mutation DeleteTrigger($uuid: uuid!) {
  delete_trigger(where: {uuid: {_eq: $uuid}}) {
    affected_rows
    returning {
      uuid
    }
  }
}`,
        variables: {
            uuid: triggerUUID,
        }
    },
        tag: "test",
        job: "user deletes a trigger",
        fail: false,
        status: 200,
        token: token,
    };

    const response = post_abstract_with_payload(delete_payload);
    console.log("delete trigger response:", response);
}
