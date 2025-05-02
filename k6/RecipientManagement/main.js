import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login ********************* //

    //*************  CREATE Recipient (POST request) *********************//
    export  function create_recipient(token) {

    const post_metadata_recipient = {
        url: `${BASE_URL}/notification/target`,
        payload: {
           "name": `test-${randomString(10)}`, 
            "configuration": {
                "type": "PLATFORM_USERS",
                "description":randomString(20),
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
    const post_recipient_response = post_abstract_with_payload(post_metadata_recipient);
    console.log("create recipient : ",post_recipient_response); 
  
    const notificationID = post_recipient_response.data.id.id; // extract the recipient ID from the response
    console.log(`Recipient ID: ${notificationID}`); // Log the recipient ID

    sleep(0.5);
    return notificationID;
}

    
    // *********************     UPDATE Recipient (POST request)   *********************//   
    export  function edit_recipient(token,notificationID) {
      
    const update_metadata_recipient = {
        url: `${BASE_URL}/notification/target`,
        payload: {
            "id": { "entityType": "NOTIFICATION_TARGET", "id": notificationID }, 
            "createdTime": 1741876917921,
            "tenantId": { "entityType": "TENANT", "id": "aeddc290-ef6c-11ef-a2cf-8be4056be751" },
            "name": `updated-${randomString(5)}`, 
            "configuration": {
                "type": "PLATFORM_USERS",
                "usersFilter": { "type": "AFFECTED_USER" },
                "description": "updated description"
            }
        },
        tag: "test",
        job: "user updates recipient",
        fail: false,
        status: 200,
        token: token,
        };
    const update_recipient_response = post_abstract_with_payload(update_metadata_recipient);
    console.log("update recipient : ",update_recipient_response);
    sleep(0.5);
    }


    //*************  GET recipients list (GET request) *********************//
    export  function get_recipient(token,notificationID) {


    const get_list_metadata = {
        url: `${BASE_URL}/notification/targets?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC`,
        tag: 'test',
        job: 'get recipients list',
        fail: false,
        status: 200,
        token: token,
        };
    const get_list_response = get_abstract_without_payload(get_list_metadata);
    console.log("get list : ",get_list_response);
    sleep(0.5);

    //*************  COPY recipients  (POST request) *********************//
    const post_copy_recipient = {
        url: `${BASE_URL}/notification/target`,
        payload: {
            "id": {
                "entityType": "NOTIFICATION_TARGET",
                "id": notificationID
            },
            "configuration": {
                "type": "PLATFORM_USERS",
                "usersFilter": {
                    "type": "ORIGINATOR_ENTITY_OWNER_USERS"
                }
            },
            "description": "updated description;,nbvcxxcvbn",
            "type": "PLATFORM_USERS",
            "usersFilter": {
                "type": "ORIGINATOR_ENTITY_OWNER_USERS"
            },
            "createdTime": 1742330465602,
            "name": `test-copy-${randomString(5)}`, 
            "tenantId": {
                "entityType": "TENANT",
                "id": "aeddc290-ef6c-11ef-a2cf-8be4056be751"
            }
        },
        tag: 'test',
        job: 'copy recipient',
        fail: false,
        status: 200,
        token: token,
    };
    const post_copy_response = post_abstract_with_payload(post_copy_recipient);
    console.log("copy recipient:",post_copy_response);
    sleep(0.5);
}

    
    //*************  DELETE recipient (DELETE request) *********************//
    export  function delete_recipient(token,notificationID) {

    const delete_notification_metadata = {
        url: `${BASE_URL}/notification/target/${notificationID}`,
        tag: 'test',
        job: 'user deletes a recipient',
        fail: false,
        status: 200,
        token: token,
        };
    const delete_notification_result = delete_abstract_without_payload(delete_notification_metadata);
    console.log("delete recipient:",delete_notification_result);    
    sleep(0.5);

  }
