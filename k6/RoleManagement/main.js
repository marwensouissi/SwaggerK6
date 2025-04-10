import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE or EDIT Role (POST request) *********************//
    const post_metadata_role = {
        url: `${BASE_URL}/role`,
        payload: {
            name: randomString(10),
            description:randomString(10),
            annotationRole: null,
            assetPermissions: {permissions: [], canCreate: false},
            cameraPermissions: {permissions: [], canCreate: false},
            canManageBusinessAccelerators: false,
            canManageCustomer: false,
            canManageExperiences: false,
            canManageNotification: false,
            canManageUsers: false,
            computeDevicePermissions: {permissions: [], canCreate: false},
            customerId: {entityType: "CUSTOMER", id: "13814000-1dd2-11b2-8080-808080808080"},
            dashboardPermissions: {permissions: [], canCreate: false},
            devicePermissions: {permissions: [], canCreate: false},
            entityViewPermissions: {permissions: [], canCreate: false},
            menus: {platform: [], mobile: []},
            mlflowPermissions: {experimentPermissions: [], registeredModelPermissions: []},
            storagePermissions: {permissions: [], canCreate: false},
            type: "GROUP",
            userIds: []
        },
        tag: "test",
        job: "user creates or edits a new role",
        fail: false,
        status: 200,
        token: token,
    };
    const post_role_result = post_abstract_with_payload(post_metadata_role);
    console.log(post_role_result); // Journaliser la réponse
    
    const roleID = post_role_result.data.id.id;
    console.log("role ID: ", roleID); // Log the role ID for further use

    sleep(0.5);

    
    //************* DELETE Role (DELETE request) *********************//
    const delete_metadata_role = {
        url: `${BASE_URL}/role/${roleID}`,
        payload: null,
        tag: "test",
        job: "user deletes a role",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_role_result = delete_abstract_without_payload(delete_metadata_role);
    console.log(delete_role_result); // Journaliser la réponse
    sleep(0.5);

    sleep(0.1);

}