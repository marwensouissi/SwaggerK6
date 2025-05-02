import http from 'k6/http';
import { check, sleep } from 'k6';
import { delete_abstract_without_payload, get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload } from '../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************/


    //*************  CREATE Subdomain (POST Request) *********************/
    export  function Create_subdomain(token) {

    const post_metadata_subdomain = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            operationName: "SaveSubdomainWildCard",
            query: `mutation SaveSubdomainWildCard($tenant_id: uuid!, $subdomain: String!, $type: String!, $theme_id: Int) {
                createSubdomain(
                    arg1: {tenant_id: $tenant_id, subdomain: $subdomain, type: $type, theme_id: $theme_id}
                ) {
                    message
                    status
                    subdomain
                    code
                    __typename
                }
            }`,
            variables: {
                tenant_id: "fb978b40-f811-11ef-981b-31dced26e2fc",
                subdomain: "subdomain",
                theme_id: null,
                type: "random"
            }
        },
        tag: "test",
        job: "Create a new Domain",
        fail: false,
        status: 200, 
        token: token,
    };
    const post_subdomain_response = post_abstract_with_payload(post_metadata_subdomain);
    console.log("Create domain response: ", post_subdomain_response);

    const subdomainId = post_subdomain_response.data.data.createSubdomain.subdomain; 
    sleep(0.5);
    return subdomainId ;

}
    //*************  EDIT Subdomain (Post Request) *********************//
    export  function Edit_subdomain(token,subdomainId) {

    const put_metadata_subdomain = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            operationName: "EditSubdomain",
            query: `mutation EditSubdomain($id: Int!, $theme_id: Int!) {
                update_subdomain(where: {id: {_eq: $id}}, _set: {theme_id: $theme_id}) {
                    returning {
                        theme_id
                        __typename
                    }
                __typename
                }
            }`,
            variables: {
                id: 1485,
                theme_id: 534
            }
        },
        tag: "test",
        job: "Edit a Domain",
        fail: false,
        status: 200, 
        token: token,
    };
    const put_subdomain_response = post_abstract_with_payload(put_metadata_subdomain);
    console.log("Edit domain response: ", put_subdomain_response);
    sleep(0.5);

}


    //*************  DELETE Subdomain (POST Request) *********************//

    export  function Delete_subdomain(token,subdomainId) {

    const delete_metadata_subdomain = {
        url: `https://dev-itona.xyz/graph/v1/graphql`,
        payload: {
            operationName: "deletesubdomain",
            query: `mutation deletesubdomain($subdomain_id: Int!) {
                delete_subdomain(where: {id: {_eq: $subdomain_id}}) {
                    returning {
                       id
                        value
                        __typename
                    }
                    __typename
                }
            }`,
            variables: {
                subdomain_id: subdomainId
            }
        },
        tag: "test",
        job: "Delete a Domain",
        fail: false,
        status: 200, 
        token: token,
    };
    const delete_subdomain_response = post_abstract_with_payload(delete_metadata_subdomain);
    console.log("Delete domain response: ", delete_subdomain_response);
    sleep(0.5);

}