import http from 'k6/http';
import { check, sleep } from 'k6';
import {post_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//

    //************* CREATE Data Source (POST request) *********************//
    export  function Create_Datasource(token) {

    const post_metadata_dataSRC = {
        url: `${BASE_URL}/storage`,
        payload: {
            "isPublic": true,
            "name": randomString(15),
        },
        tag: "test",
        job: "user creates a data source",
        fail: false,
        status: 200,
        token: token,
    };
    const post_dataSRC_response = post_abstract_with_payload(post_metadata_dataSRC);
    console.log("create data source : ", post_dataSRC_response); 

    const dataID = post_dataSRC_response.data.id.id;
    sleep(0.5);
    return dataID;

}


    //************* DELETE Data Source (DELETE request) *********************//
    export  function Delete_Datasource(token,dataID) {

    const delete_metadata_dataSRC = {
        url: `${BASE_URL}/storage/${dataID}`,
        tag: "test",
        job: "user deletes a data source",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_dataSRC_response = delete_abstract_without_payload(delete_metadata_dataSRC);
    console.log("delete data source : ",delete_dataSRC_response); 
    sleep(0.5);
}