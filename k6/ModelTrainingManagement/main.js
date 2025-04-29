import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE model training (POST request) *********************//
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

    const trainingID = post_training_response.data.experiment_id; // Extract the training ID from the response
    console.log(`training ID: ${trainingID}`); //   Log the training ID
    sleep(0.5);

    //************* EDIT model training (POST request) *********************//
    const edit_metadata_training = {
        url: `https://dev-itona.xyz/train/ajax-api/2.0/mlflow/experiments/update`,
        payload: {
            experiment_id: `${trainingID}`,
            new_name: `edited-${randomString(8)}`
        },
        tag: "test",
        job: "user edits a training",
        fail: false,
        status: 200,
        token: token,
    };
    const edit_training_response = post_abstract_with_payload(edit_metadata_training); 
    console.log("edit training : ", edit_training_response);
    sleep(0.5);
    
    //************* DELETE model training (POST request for deletion) *********************//
    const delete_metadata_training = {
        url: `https://dev-itona.xyz/train/ajax-api/2.0/mlflow/experiments/delete`, // Ensure this URL is correct
        payload: {
            "experiment_id": `${trainingID}` 
        },        
        tag: "test",
        job: "user deletes a training",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_training_response = post_abstract_with_payload(delete_metadata_training); // Use POST instead of DELETE
    console.log("delete training : ",delete_training_response); 
    sleep(0.5);
}