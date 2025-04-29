import http from 'k6/http';
import { check, sleep } from 'k6';
import { delete_abstract_without_payload, patch_abstract_with_payload, post_abstract_with_payload,put_abstract_with_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const BASE_URL = 'https://dev-itona.xyz/api';

export function createCamera(token) {
    const payload = {
        additionalInfo: {
            description: randomString(8),
            videoAnalytics: [],
            frameToggled: true
        },
        attributes: [
            { streamMode: "Push" },
            { rtspInput: "" },
            { frameWidth: 1080 },
            { frameHeight: 30 },
            { frameFps: 1920 }
        ],
        label: randomString(8),
        name: randomString(8),
        type: "Camera"
    };

    const metadata = {
        url: `${BASE_URL}/cameraDevice`,
        payload,
        tag: "test",
        job: "Create a new camera",
        fail: false,
        status: 200,
        token,
    };


    const response = post_abstract_with_payload(metadata);

    let cameraId = null;
    if (
        response &&
        response.data &&
        response.data.id &&
        response.data.id.id
    ) {
        cameraId = response.data.id.id;
    }




    return cameraId;
}



export function editCamera(cameraId,token) {

    const put_metadata_camera = {
        url: `${BASE_URL}/cameraDevice`,
        payload: {
            additionalInfo: {
                description: randomString(8),
                videoAnalytics: []
            },
            attributes: [
                { streamMode: "Push" },
                { rtspInput: "" },
                { frameWidth: 1080 },
                { frameHeight: 30 },
                { frameFps: 1920 }
            ],
            id: {
                id: `${cameraId}`,
                entityType: "DEVICE"
            },      
            label: `edited-${randomString(8)}`,
            name: `edited-${randomString(8)}`,
            type: "Camera"
        },
        tag: "test",
        job: "Edit camera",
        fail: false,
        status: 200, 
        token: token,
    };  
    const put_camera_response = post_abstract_with_payload(put_metadata_camera);
    console.log("Edit camera response: ", put_camera_response); 

    check(put_camera_response, { "camera edited": (r) => r && r.status === 200 });

}

export function exportToPDF(token) {

    const payload = {
        format: "pdf",
        lang: "en_US",
        config: {
            en_US: {
                "cameras-list": "Cameras List",
                "edit-camera": "Edit Camera"
            }
        },
        entityAliasQuery: {
            query: {
                entityFilter: {
                    type: "entityType",
                    resolveMultiple: true,
                    entityType: "DEVICE"
                }
            }
        },
        filters: {},
        keys: [],
        labelConfig: [{ label: "Label", key: "label", type: "entityField" }],
        title: "cameras-list",
        totalElements: 9,
        type: "ENTITY_ALIAS"
    };

    const metadata = {
        url: `${BASE_URL}/report?format=pdf&lang=en_US`,
        payload,
        tag: "test",
        job: "Export to pdf",
        fail: false,
        status: 200,
        token,
    };

    const res = post_abstract_with_payload(metadata);
    check(res, { "exported PDF": (r) => r && r.status === 200 });
    sleep(0.5);
}

export function exportToCSV(token) {

    const payload = {
        format: "csv",
        lang: "en_US",
        config: {
            en_US: {
                "cameras-list": "Cameras List",
                "edit-camera": "Edit Camera"
            }
        },
        entityAliasQuery: {
            query: {
                entityFilter: {
                    type: "entityType",
                    resolveMultiple: true,
                    entityType: "DEVICE"
                }
            }
        },
        filters: {},
        keys: [],
        labelConfig: [{ label: "Label", key: "label", type: "entityField" }],
        title: "cameras-list",
        totalElements: 12,
        type: "ENTITY_ALIAS"
    };

    const metadata = {
        url: `${BASE_URL}/report?format=csv&lang=en_US`,
        payload,
        tag: "test",
        job: "Export to csv",
        fail: false,
        status: 200,
        token,
    };

    const res = post_abstract_with_payload(metadata);
    console.log("Export CSV response:", res);
    check(res, { "exported CSV": (r) => r && r.status === 200 });
    sleep(0.5);
}

export function deleteCamera(cameraId,token) {

const delete_metadata_camera = {
        url: `${BASE_URL}/device/${cameraId}`,
        tag: "test",
        job: "Delete camera",
        fail: false,
        status: 200, 
        token: token,
    };
    const delete_camera_response = delete_abstract_without_payload(delete_metadata_camera);
    console.log("Delete camera response: ", delete_camera_response); 
    sleep(0.5); 
    
}
