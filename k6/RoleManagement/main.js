import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//

    //************* CREATE Role (POST request) *********************//
    export  function create_role(token) {

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
        job: "user creates a new role",
        fail: false,
        status: 200,
        token: token,
    };
    const post_role_result = post_abstract_with_payload(post_metadata_role);
    console.log(post_role_result); 
    const roleID = post_role_result.data.id.id; // Extract the role ID from the response
    console.log("role ID: ", roleID); // log the role ID
    sleep(0.5);
    return roleID;
}

    //************* EDIT Role (POST request) *********************//
    export  function edit_role(token,roleID) {

    const edit_metadata_role = {
        url: `${BASE_URL}/role`,
        payload: {
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
            description: `${randomString(20)}`,
            devicePermissions: {permissions: [], canCreate: false},
            entityViewPermissions: {permissions: [], canCreate: false},
            id: {entityType: "ROLE", id: roleID},
            menus: {platform: [], mobile: []},
            mlflowPermissions: {experimentPermissions: [], registeredModelPermissions: []},
            name: `edited-${randomString(8)}`,
            storagePermissions: {permissions: [], canCreate: false},
            type: "GROUP",
            userIds: []
            
        },
        tag:"test",
        job:"user edits a role",
        fail:false,
        status : 200,
        token : token
    };
    const edit_role_result = post_abstract_with_payload(edit_metadata_role);
    console.log(edit_role_result); 

}



    //************* DELETE Role (DELETE request) *********************//

    export  function delete_role(token,roleID) {

    const delete_metadata_role = {
        url: `${BASE_URL}/role/${roleID}`,
        tag: "test",
        job: "user deletes a role",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_role_result = delete_abstract_without_payload(delete_metadata_role);
    console.log("delete role:",delete_role_result); 
    sleep(0.5);
    

}