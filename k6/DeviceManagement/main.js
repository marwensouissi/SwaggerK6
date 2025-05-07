import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, delete_abstract_without_payload } from '../utils/abstract.js';
import file from 'k6/x/file';
import { connectMQTT } from '../utils/mqttClient.js'

import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';



    //*************  POST CREATE DEVICE *********************/ 

    export  function Create_device(token) {

    const post_metadata_device = {
        url: `${BASE_URL}/device`,
        payload: {
            "name": `device-${randomString(5)}`,
            "label": "Test Device",
            "additionalInfo": {
                "gateway": false,
                "overwriteActivityTime": false,
                "description": ""
            }
        },
        tag: "device",
        job: "Create a new device",
        status: 200, // API usually returns 201 for new resource creation
        token: token,
    };

    const post_device_result = post_abstract_with_payload(post_metadata_device);


    
    sleep(0.5);
    return post_device_result.data;

}

export function saveCredentialsToFile(credentialsId) {
    let existingData = [];

    try {
        const fileContent = file.readString(FILE_PATH).trim();
        if (fileContent) {
            existingData = JSON.parse(fileContent);
            if (!Array.isArray(existingData)) existingData = [];
        }
    } catch (error) {
        console.warn("⚠️ No existing credentials file found, creating a new one.");
    }



    existingData.push({ credentialsId });

    try {
        file.writeString(FILE_PATH, JSON.stringify(existingData, null, 2));
        console.log(`✅ Credentials saved: ${credentialsId}`);
    } catch (error) {
        console.error("❌ Error writing credentials to file!", error);
    }
}


    //************* FETCH DEVICE CREDENTIALS *********************/

    export function Create_device_and_send_telemetry(token) {
        const deviceId = Create_device(token);
        console.log(deviceId);
        console.log(deviceId);
        console.log(deviceId);
        console.log(deviceId);
        const credentialsId = Get_device(token, deviceId);

        console.log(credentialsId);
        console.log(credentialsId);
        console.log(credentialsId);
        console.log(credentialsId);
    
        const mqttClient = connectMQTT(credentialsId);
    
        for (let i = 0; i < 5; i++) {
            sendTelemetry(mqttClient, credentialsId);
            sleep(0.2);
        }
    
        mqttClient.close();
    }








        //************* FETCH DEVICE CREDENTIALS *********************/

    export  function Get_device(token,deviceId) {

    const get_device_credentials = {
        url: `${BASE_URL}/device/${deviceId}/credentials`,
        tag: "device",
        job: "Fetch device credentials",
        fail: false,
        token: token,
    };


    const device_data = get_abstract_with_payload(get_device_credentials);

     const credentialsId = device_data.data.credentialsId;

     return credentialsId ;
    //************* UPDATE DEVICE (PUT REQUEST) *********************/

}



export  function delete_device(token,deviceId) {

    const delete_metadata_device = {
        url: `${BASE_URL}/device/${deviceId}`,
        tag: "test",
        job: "user deletes a device",
        fail: false,
        status: 200,
        token: token,
        };
    const delete_device_response = delete_abstract_without_payload(delete_metadata_device);
    console.log("delete device : ",delete_device_response); 
    sleep(0.5); 

}

export  function public_device(token,deviceId) {

    const delete_metadata_device = {
        url: `${BASE_URL}/customer/public/device/${deviceId}`,
        payload: {
            "id": {
                "entityType": "DEVICE",
                "id": "deviceId"
            },
            "createdTime": 1743687466695,
            "additionalInfo": {
                "gateway": false,
                "overwriteActivityTime": false,
                "description": ""
            },
            "deviceData": {
                "configuration": {
                    "type": "DEFAULT"
                },
                "transportConfiguration": {
                    "type": "DEFAULT"
                }
            },
            "firmwareId": null,
            "softwareId": null,
            "externalId": null,

        },
        tag: "test",
        job: "user publish a device",
        fail: false,
        status: 200,
        token: token,
        };
    const delete_device_response = post_abstract_with_payload(delete_metadata_device);
    console.log(delete_device_response);
    sleep(0.5); 

}

export  function private_device(token,deviceId) {

    const delete_metadata_device = {
        url: `${BASE_URL}/customer/device/${deviceId}`,
        payload: {
            "id": {
                "entityType": "DEVICE",
                "id": "deviceId"
            },
            "createdTime": 1743687466695,
            "additionalInfo": {
                "gateway": false,
                "overwriteActivityTime": false,
                "description": ""
            },
            "deviceData": {
                "configuration": {
                    "type": "DEFAULT"
                },
                "transportConfiguration": {
                    "type": "DEFAULT"
                }
            },
            "firmwareId": null,
            "softwareId": null,
            "externalId": null,

        },
        tag: "test",
        job: "user publish a device",
        fail: false,
        status: 200,
        token: token,
        };
    const delete_device_response = delete_abstract_without_payload(delete_metadata_device);
    console.log(delete_device_response);
    sleep(0.5); 

}

