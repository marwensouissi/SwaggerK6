import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
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
    console.log(post_chain_result); // Journaliser la réponse

    const chainId = post_chain_result.data.id.id;
    console.log(`Chain ID: ${chainId}`);
    sleep(0.5);


    //************* UPDATE Chain (POST request) *********************//
    const update_metadata_chain = {
      url: `${BASE_URL}/vidAnalChain`,
      payload: {
        "tenantId": {
          "entityType": "TENANT",
          "id": "aeddc290-ef6c-11ef-a2cf-8be4056be751"
        },
        "name": `edit-${randomString(8)}`,
        "description": `edit-${randomString(30)}`,
        "additionalInfo": {
          "description": `edit-${randomString(30)}`
        },
        "debugMode": null,
        "type": "CORE",
        "root": false,
        "nodes": {
          "nodesList": []
        },
        "connections": []
      },
      tag: "test",
      job: "user updates a vidAnalChain",
      fail: false,
      status: 200,
      token: token,
  };
  const update_chain_response = post_abstract_with_payload(update_metadata_chain);
  console.log(update_chain_response); // Journaliser la réponse
  sleep(0.5);

}






