import http from 'k6/http';
import { check, sleep } from 'k6';
import { post_abstract_with_payload, delete_abstract_without_payload, get_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE or UPDATE Dashboard (POST request) *********************//
    const post_metadata_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "title": `Dashboard-${randomString(8)}`, // Titre aléatoire
            "image": null,
            "additionalInfo": {
                "info": randomString(10), 
            },
            "configuration": {
                "setting": randomString(5), 
            },
        },
        tag: "test",
        job: "user creates a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const post_dashboard_result = post_abstract_with_payload(post_metadata_dashboard);
    console.log("create dashboard : ",post_dashboard_result); 

    const dashId = post_dashboard_result.data.id.id; // Extract the dashboard ID from the response
    console.log("Dashboard ID: ", dashId); // Log the dashboard ID 
    sleep(0.5);


    //******************* IMPORT Dashboard (POST request) *********************//
    const post_import_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "title": `Import-${randomString(8)}`, 
            "image": null,
            "mobileHide": Math.random() < 0.5, // Booléen aléatoire
            "mobileOrder": Math.floor(Math.random() * 100), // Nombre aléatoire
            "itemIconInNavbar": randomString(5), 
            "subFolder": randomString(6), 
            "itemOrderInNavbar": Math.floor(Math.random() * 10),
            "itemOrderInSubFolder": Math.floor(Math.random() * 10),
            "installed": Math.random() < 0.5,
            "fixRow": Math.random() < 0.5,
            "pinDashboardInNavbar": Math.random() < 0.5,
            "additionalInfo": {
                "languages": {
                    "en_US": { "title": `EN-${randomString(5)}`, "description": "", "subFolder": "" },
                    "fr_FR": { "title": `FR-${randomString(5)}`, "description": "", "subFolder": "" },
                    "ar_AR": { "title": `AR-${randomString(5)}`, "description": "", "subFolder": "" }
                }
            },
            "userCreatorId": { "entityType": "USER", "id": "fb9c9450-f811-11ef-981b-31dced26e2fc" },
            "permissions": null,
            "starred": Math.random() < 0.5,
            "configuration": {
                "description": randomString(15),
                "widgets": {},
                "states": {
                    "default": {
                        "name": `State-${randomString(5)}`,
                        "root": true,
                        "layouts": {
                            "main": {
                                "widgets": {},
                                "gridSettings": {
                                    "backgroundColor": "#eeeeee",
                                    "columns": 24,
                                    "margin": 10,
                                    "backgroundSizeMode": "100%"
                                }
                            }
                        }
                    }
                },
                "entityAliases": {},
                "filters": {},
                "timewindow": {
                    "displayValue": "",
                    "hideInterval": false,
                    "hideLastInterval": false,
                    "hideQuickInterval": false,
                    "hideAggregation": false,
                    "hideAggInterval": false,
                    "hideTimezone": false,
                    "selectedTab": 0,
                    "realtime": { "realtimeType": 0, "interval": 1000, "timewindowMs": 60000, "quickInterval": "CURRENT_DAY" },
                    "history": { "historyType": 0, "interval": 1000, "timewindowMs": 60000, "fixedTimewindow": { "startTimeMs": Date.now() - 60000, "endTimeMs": Date.now() }, "quickInterval": "CURRENT_DAY" },
                    "aggregation": { "type": "AVG", "limit": 25000 }
                },
                "settings": {
                    "stateControllerId": "entity",
                    "showTitle": false,
                    "showDashboardsSelect": true,
                    "showEntitiesSelect": true,
                    "showDashboardTimewindow": true,
                    "showDashboardExport": true,
                    "toolbarAlwaysOpen": true
                }
            },
            "externalId": null,
            "name": `Dashboard-${randomString(8)}`
        },
        tag: "test",
        job: "user imports a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const post_import_result = post_abstract_with_payload(post_import_dashboard);
    console.log("import dashboard : ",post_import_result); 
    sleep(0.5);


    //************* EXPORT dashboard (GET request) *********************//
    const get_metadata_dashboard = {
        url: `${BASE_URL}/dashboard/${dashId}`,
        tag: "test",
        job: "user exports a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const get_dashboard_result = get_abstract_without_payload(get_metadata_dashboard);
    console.log("export dashboard : ",get_dashboard_result); 
    sleep(0.5);
    
    sleep(1);
}
