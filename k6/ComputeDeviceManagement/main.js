import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//

    //************* CREATE Compute Device (POST request) *********************//
    export  function Create_Compute_Device(token) {

    const post_metadata_compute_device = {
        url: `${BASE_URL}/computeDevice`,
        payload: {
            name: randomString(15),
            additionalInfo: {
                gateway: true,
                overwriteActivityTime: false,
                description: randomString(15)
            },
            attributes: [
                { device_type: "edge" }
            ],
            diskSize: null,
            gpuType: null,
            label: randomString(15),
            region: null,
            sharedAttributes: [
                { visionEngineVersion: "hailo-0.10.1-101", gatewayVersion: "3.6.3-4" }
            ],
            type: "Compute device"
        },
        tag: "test",
        job: "user creates a compute device",
        fail: false,
        status: 200,
        token: token,
    };
    const post_compute_device_result = post_abstract_with_payload(post_metadata_compute_device);
    console.log("create compute device: ",post_compute_device_result); 
    sleep(0.5);

    return post_compute_device_result.data.id.id;

}

export  function Download_config_file(token,computeDeviceID) {

    //************* DOWNLOAD configration file (GET request) *********************//
    
    const get_metadata_configFile = {
        url: `${BASE_URL}/device-connectivity/gateway-launch/${computeDeviceID}/docker-compose/download`,
        tag: "test",
        job: "user downloads config file",
        fail: false,
        status: 200,
        token: token,
    };
    const get_configFile_result = get_abstract_without_payload(get_metadata_configFile);
    console.log("get config file: ",get_configFile_result); 
    sleep(0.5);

}

export  function Delete_Compute_Device(token,computeDeviceID) {

    //************* DELETE Compute Device (DELETE request) *********************//


    const delete_metadata_compute_device = {
        url: `${BASE_URL}/computeDevice/${computeDeviceID}`,
        tag: "test",
        job: "user deletes a compute device",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_compute_device_result = delete_abstract_without_payload(delete_metadata_compute_device);       
    console.log("delete compute device: ",delete_compute_device_result); 
    sleep(0.5);

}