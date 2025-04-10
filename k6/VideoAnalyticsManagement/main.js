import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE or EDIT Chain (POST request) *********************//
    const post_metadata_chain = {
        url: `${BASE_URL}/vidAnalChain`,
        payload: {
            "tenantId": {
              "entityType": "TENANT",
              "id": "aeddc290-ef6c-11ef-a2cf-8be4056be751"            
            },
            "name": randomString(15), 
            "description": randomString(100), 
            "additionalInfo": {
              "description": randomString(50) 
            },
            "debugMode": Math.random() > 0.5,
            "type": "CORE",
            "root": Math.random() > 0.5, 
            "nodes": {
              "nodesList": [] 
            },
            "connections": [] 
          },
        tag: "test",
        job: "user creates or edits a vidAnalChain",
        fail: false,
        status: 200,
        token: token,
    };
    const post_chain_result = post_abstract_with_payload(post_metadata_chain);
    console.log(post_chain_result); // Journaliser la réponse

    const chainId = post_chain_result.data.id.id;
    console.log(`Chain ID: ${chainId}`);
    sleep(0.5);


    // **********************  DELETE vidanalytic  ********************* //
    const delete_metadata_chain = {
      url: `${BASE_URL}/vidAnalChain/${chainId}`,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      tag: "delete_request",
      job: "Delete an item",
      fail: false,
      status: 200,
      token: token,
    };
    const delete_response = delete_abstract_without_payload(delete_metadata_chain);
    console.log(`DELETE Response: ${JSON.stringify(delete_response)}`);
    sleep(0.5);

    sleep(0.1);

}






