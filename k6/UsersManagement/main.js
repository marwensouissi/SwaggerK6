import http from 'k6/http';
import { check, sleep } from 'k6';
import { post_abstract_with_payload, delete_abstract_without_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//

    //************* CREATE User (POST request) *********************//
    export  function create_user(token) {

    const post_metadata_user = {
        url: `${BASE_URL}/user/assign-roles?sendActivationMail=true`,
        payload: {
            email: `${randomString(8)}@gmail.com`,
            firstName: randomString(8),
            lastName: randomString(8),
            defaultDashboardFullscreen: false,
            defaultDashboardId: null,
            description: randomString(8),
            displayListOfDevicesInMobileVersion: true,
            homeDashboardHideToolbar: true,
            homeDashboardId: null,
            authority: "TENANT_ADMIN",
            customerId: {
                entityType: "CUSTOMER",
                id: "13814000-1dd2-11b2-8080-808080808080"
            },
            roles: ["ef5bc6c0-1076-11f0-9780-3d2f4db9b6ce"],
            tenantId: {
                entityType: "TENANT",
                id: "aeddc290-ef6c-11ef-a2cf-8be4056be751"
            }
        },
        tag: "test",
        job: "user creates a new user",
        fail: false,
        status: 200,
        token: token,
    };
    const post_user_result = post_abstract_with_payload(post_metadata_user);
    console.log("create user: ",post_user_result); 
    const userID = post_user_result.data.id.id; // Extract the user ID from the response
    console.log("user ID: ", userID); // Log the customer ID 
    sleep(0.5);
return userID;
}

    //************* EDIT User (POST request) *********************//
    export  function edit_user(token,userID) {

    const edit_metadata_user = {
        url: `${BASE_URL}/user?sendActivationMail=false`,
        payload: {
            authProviderName: false,
            defaultDashboardFullscreen: false,
            defaultDashboardId: null,
            description: `${randomString(20)}`,
            displayListOfDevicesInMobileVersion: true,
            homeDashboardHideToolbar: true,
            isOwner: false,
            lang: "en_US",
            phone: "",
            authority: "TENANT_ADMIN",
            createdTime: 1743774936857,
            customerId: {
                entityType: "CUSTOMER",
                id: "13814000-1dd2-11b2-8080-808080808080"
            },
            email: `${randomString(20)}@gmail.com`,
            firstName: `edited-${randomString(20)}`,
            id: {
                entityType: "USER",
                id: `${userID}`
            },
            isSuperUser: false,
            lastName: `edited-${randomString(20)}`,
            name: `${randomString(20)}@gmail.com`,
            phone: null,
            tenantId: {
                entityType: "TENANT",
                id: "aeddc290-ef6c-11ef-a2cf-8be4056be751"
            },
            userCreatorId: {
                entityType: "USER",
                id: "aee340d0-ef6c-11ef-a2cf-8be4056be751"
            }
        },
        tag: "test",
        job: "user edits a user",
        fail: false,
        status: 200,
        token: token,
    };
    const edit_user_result = post_abstract_with_payload(edit_metadata_user);
    console.log("edit user: ",edit_user_result); 
    sleep(0.5);

}
    
     //************* DELETE User (DELETE request) *********************//
     export  function delete_user(token,userID) {

     
     const delete_metadata_user = {
        url: `${BASE_URL}/user/${userID}`,
        payload: null,
        tag: "test",
        job: "user deletes a user",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_user_result = delete_abstract_without_payload(delete_metadata_user);
    console.log("delete user: ",delete_user_result); 
    sleep(0.5);

}