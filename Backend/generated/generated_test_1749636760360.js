import {
get_abstract_with_payload,
get_abstract_without_payload,
post_abstract_with_payload,
patch_abstract_with_payload,
delete_abstract_without_payload,
put_abstract_with_payload
} from '../k6/utils/abstract.js';
import { signup, login } from '../k6/AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const PASSWORD = "123123123";

export let options = {
stages: [
    { duration: '2s', target: 2 }]
};

export default function () {
const user = signup();
const token = login(user.email, PASSWORD);

const createDev = post_abstract_with_payload({
url: `https://dev-itona.xyz:443/api/computeDevice`,
        token: token,
        tag: "createDevssssssss",
        job: "createDevssssssss",
          payload: {"additionalInfo": {}, "attributes": [{}], "customerId": {"entityType": "CUSTOMER", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "deviceData": {"configuration": {}, "transportConfiguration": {}}, "deviceProfileId": {"entityType": "DEVICE_PROFILE", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "deviceToken": "string", "diskSize": 0, "firmwareId": {"entityType": "OTA_PACKAGE", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "gpuType": "string", "id": {"entityType": "DEVICE", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "label": "Room 234 Sensor", "name": randomString(15), "publicKey": "string", "region": "string", "sharedAttributes": [{}], "softwareId": {"entityType": "OTA_PACKAGE", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "tenantId": {"entityType": "TENANT", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "type": "Temperature Sensor", "userCreatorId": {"entityType": "USER", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}}
      });
const pub = post_abstract_with_payload({
url: `https://dev-itona.xyz:443/api/customer/public/device/{{createDev.data.id.id}}`,
        token: token,
        tag: "pub",
        job: "pub",
          payload: {}
      });
}