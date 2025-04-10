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
    const post_metadata_training = {
        url: `https://dev-itona.xyz/train/ajax-api/2.0/mlflow/experiments/create`,
        payload: {
            "artifact_location": randomString(20),
            "name": randomString(15),
        },
        tag: "test",
        job: "user creates a training",
        fail: false,
        status: 200,
        token: token,
    };
    const post_training_response = post_abstract_with_payload(post_metadata_training);
    console.log("create training : ", post_training_response); 

    const trainingID = post_training_response.data.experiment_id; // Correctly access the experiment_id
    console.log(`training ID: ${trainingID}`); 
    sleep(0.5);


    //************* DELETE package (DELETE request) *********************//
    const delete_metadata_training = {
        url: `https://dev-itona.xyz/train/ajax-api/2.0/mlflow/experiments/delete`,
        payload: {
            "experiment_id": trainingID
        },        
        tag: "test",
        job: "user deletes a training",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_training_response = delete_abstract_without_payload(delete_metadata_training);
    console.log("delete training : ",delete_training_response); // Journaliser la réponse
    sleep(0.5);

    sleep(1);
}