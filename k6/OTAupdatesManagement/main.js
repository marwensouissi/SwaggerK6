import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE Package (POST request) *********************//
    const post_metadata_package = {
        url: `${BASE_URL}/otaPackage`,
        payload: {
            "title": randomString(15),
            "description": randomString(15),
            "type": "FIRMWARE",
            "url": "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json",
            "version": "1",
            "isURL": true,
            "tag": randomString(15),
            "checksum": null,
            "checksumAlgorithm": "SHA256",
            "deviceProfileId": { "entityType": "DEVICE_PROFILE", "id": "e795f500-0bc6-11f0-988a-cfdcd328c9b8"}

        },
        tag: "test",
        job: "user creates a package",
        fail: false,
        status: 200,
        token: token,
    };
    const post_package_response = post_abstract_with_payload(post_metadata_package);
    console.log("create package : ", post_package_response); 

    const packageID = post_package_response.data.id.id; // Extract the package ID from the response
    console.log(`Package ID: ${packageID}`); // Log the package ID
    sleep(0.5);

    sleep(1);
}