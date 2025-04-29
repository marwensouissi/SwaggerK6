import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE Chain (POST request) *********************//
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
        job: "user creates a vidAnalChain",
        fail: false,
        status: 200,
        token: token,
    };
    const post_chain_result = post_abstract_with_payload(post_metadata_chain);
    console.log(post_chain_result); 

    const chainId = post_chain_result.data.id.id; // Extract the chain ID from the response
    console.log(`Chain ID: ${chainId}`); // Log the chain ID
    sleep(0.5);

    //************* EDIT Chain (POST request) *********************//
    const edit_metadata_chain = {
        url: `${BASE_URL}/vidAnalChain`,
        payload: {
          "connections": [],
          "debugMode": null,
          "description": `${randomString(20)}`,
          "id": {
              "entityType": "VID_ANALYTIC_CHAIN",
              "id": chainId
          },
          "name": `edited-${randomString(20)}`,
          "nodesList": [],
          "root": false,
          "tenantId": {
              "entityType": "TENANT",
              "id": "aeddc290-ef6c-11ef-a2cf-8be4056be751"
          },
          "type": "CORE"
          },
        tag: "test",
        job: "user edits a vidAnalChain",
        fail: false,
        status: 200,
        token: token,
    };
    const edit_chain_result = post_abstract_with_payload(edit_metadata_chain);
    console.log("edit chain: ",edit_chain_result); 
    sleep(0.5);

    // **********************  DELETE vidanalytic (DELETE request) ********************* //
    const delete_metadata_chain = {
      url: `${BASE_URL}/vidAnalChain/${chainId}`,
      tag: "delete_request",
      job: "Delete a vidAnalChain",
      fail: false,
      status: 200,
      token: token,
    };
  const delete_response = delete_abstract_without_payload(delete_metadata_chain);
  console.log(`delete chain: `, delete_response); // Log the response
  sleep(0.5);


}






