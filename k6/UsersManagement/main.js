import http from 'k6/http';
import { check, sleep } from 'k6';
import { post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE User (POST request) *********************//
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
    console.log(post_user_result); // Journaliser la réponse

    const userID = post_user_result.data.id.id;
    console.log("user ID: ", userID); // Log the customer ID for further use
    sleep(0.5);

    //************* DELETE User (DELETE request) *********************//
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
    console.log(delete_user_result); // Journaliser la réponse
    sleep(0.5);

    sleep(0.1);
}