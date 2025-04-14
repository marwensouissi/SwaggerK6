import http from 'k6/http';
import { check, sleep } from 'k6';
import { delete_abstract_without_payload, get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************/
    const token = login("hrnou25@gmail.com", "123456789");


    //*************  CREATE Camera (POST Request) *********************/
    const post_metadata_camera = {
        url: `${BASE_URL}/cameraDevice`,
        payload: {
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
    },
        tag: "test",
        job: "Create a new camera",
        fail: false,
        status: 200, 
        token: token,
    };

    const post_camera_response = post_abstract_with_payload(post_metadata_camera);
    console.log("Create camera response: ", post_camera_response); 

    const cameraId = post_camera_response.data.id.id; // Extract the camera ID from the response
    console.log("Camera ID: ", cameraId); // Log the camera ID
    sleep(0.5);

    //*************  EDIT Camera (Post Request) *********************//
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
    sleep(0.5);

    //************* EXPORT TO PDF (Post Request)   *********************//
    const export_metadata_pdf = {
        url: `${BASE_URL}/report?format=pdf&lang=en_US`,
        payload: {
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
            labelConfig: [
                { label: "Label", key: "label", type: "entityField" }
            ],
            title: "cameras-list",
            totalElements: 9,
            type: "ENTITY_ALIAS"
        },
        tag: "test",
        job: "Export to pdf",
        fail: false,
        status: 200, 
        token: token,
    };
    const export_pdf_response = post_abstract_with_payload(export_metadata_pdf);
    console.log("Export pdf response: ", export_pdf_response); 
    sleep(0.5);

    //************* EXPORT TO CSV (Post Request)   *********************//
    const export_metadata_csv = {
        url: `${BASE_URL}/report?format=csv&lang=en_US`,
        payload: {
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
            labelConfig: [
                { label: "Label", key: "label", type: "entityField" }
            ],
            title: "cameras-list",
            totalElements: 12,
            type: "ENTITY_ALIAS"   
        },
        tag: "test",
        job: "Export to csv",
        fail: false,
        status: 200, 
        token: token,
    };
    const export_csv_response = post_abstract_with_payload(export_metadata_csv);
    console.log("Export csv response: ", export_csv_response); 
    sleep(0.5);



    //************* DELETE Camera (Post Request) *********************//
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

    sleep(1);

}