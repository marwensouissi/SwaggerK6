import http from 'k6/http';
import { check, sleep } from 'k6';
import { get_abstract_with_payload, post_abstract_with_payload, put_abstract_with_payload, delete_abstract_without_payload } from '../../utils/abstract.js';
import { login } from '../AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function workflow() {
    const BASE_URL = 'https://dev-itona.xyz/api';

    // ************* Login *********************//
    const token = login("henchirnouha02@gmail.com", "123456789");

    //************* CREATE Dashboard (POST request) *********************//
    const post_metadata_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "title": `Dashboard-${randomString(8)}`, // Titre aléatoire
            "image": null,
            "additionalInfo": {
                "info": randomString(10), // Information aléatoire
            },
            "configuration": {
                "setting": randomString(5), // Configuration aléatoire
            },
        },
        tag: "test",
        job: "user creates a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const post_dashboard_result = post_abstract_with_payload(post_metadata_dashboard);
    console.log(post_dashboard_result); // Journaliser la réponse

    const dashId = post_dashboard_result.data.id.id;
    sleep(0.5);

    // ********************* UPDATE Dashboard (POST request) *********************//
    const update_metadata_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "id": { "entityType": "DASHBOARD", "id": dashId },
            "title": `Updated-${randomString(8)}`, // Titre mis à jour aléatoire
            "image": null,
            "additionalInfo": {
                "info": randomString(10), // Information mise à jour aléatoire
            },
            "configuration": {
                "setting": randomString(5), // Configuration mise à jour aléatoire
            },
        },
        tag: "test",
        job: "user updates the dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const update_response = post_abstract_with_payload(update_metadata_dashboard);
    console.log(update_response); // Journaliser la réponse
    sleep(0.2);

    //******************* IMPORT Dashboard (POST request) *********************//
    const post_import_dashboard = {
        url: `${BASE_URL}/dashboard`,
        payload: {
            "title": `Import-${randomString(8)}`, // Titre aléatoire pour l'import
            "image": null,
            "mobileHide": Math.random() < 0.5, // Booléen aléatoire
            "mobileOrder": Math.floor(Math.random() * 100), // Nombre aléatoire
            "itemIconInNavbar": randomString(5), // Icône aléatoire
            "subFolder": randomString(6), // Sous-dossier aléatoire
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
        job: "user import a dashboard",
        fail: false,
        status: 200,
        token: token,
    };
    const post_import_result = post_abstract_with_payload(post_import_dashboard);
    console.log(post_import_result); // Log the response
    sleep(0.5);
    
    sleep(1);
}
