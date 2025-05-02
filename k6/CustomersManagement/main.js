import http from 'k6/http';
import { check, sleep } from 'k6';
import { post_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../utils/abstract.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';


    //************* CREATE Customer (POST request) *********************//

    export  function Create_customer(token) {

    const post_metadata_customer = {
        url: `${BASE_URL}/customer`,
        payload: {
            "customerPicture" : null,
            "title":  randomString(10),
            "description" :  randomString(20),
            "address": randomString(20),
            "address2": randomString(20),
            "city": randomString(10),
            "country": "Tunisia",
            "email": `${randomString(8)}@gmail.com`,
            "phone": "+21695623587",
            "state": "",
            "zip": "4100"
        },
        tag: "test",
        job: "user creates a new customer",
        fail: false,
        status: 200,
        token: token,
    };
    const post_customer_result = post_abstract_with_payload(post_metadata_customer);
    console.log("create customer: ",post_customer_result); 
    
    sleep(0.5);

    return  post_customer_result.data.id.id; // Extract the customer ID from the response
}


    //************* GET Customer (GET request) *********************//

    export  function Get_customer(token,customerID) {

    const get_metadata_customer = {
        url: `${BASE_URL}/customer/${customerID}`,
        tag: "test",
        job: "user gets customer",
        fail: false,
        status: 200,
        token: token,
    };
    const get_customer_result = get_abstract_without_payload(get_metadata_customer);
    console.log("get customer: ",get_customer_result); 
    sleep(0.5);
    }
    
    //************* DELETE Customer (DELETE request) *********************//
    export  function Delete_customer(token,customerID) {

    const delete_metadata_customer = {
        url: `${BASE_URL}/customer/${customerID}`,
        payload: null,
        tag: "test",
        job: "user deletes a new customer",
        fail: false,
        status: 200,
        token: token,
    };
    const delete_customer_result = delete_abstract_without_payload(delete_metadata_customer);
    console.log("delete customer: ",delete_customer_result);
    sleep(0.5);

}