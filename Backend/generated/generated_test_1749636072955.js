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
    { duration: '5588s', target: 5 },    { duration: '789s', target: 7 }]
};

export default function () {
const user = signup();
const token = login(user.email, PASSWORD);

const yooooooo = post_abstract_with_payload({
url: `https://dev-itona.xyz:443/api/asset`,
        token: token,
        tag: "yooooooo",
        job: "yooooooo",
          payload: {"assetProfileId": {"entityType": "ASSET_PROFILE", "id": "784f394c-42b6-435a-983c-b7beff2784f9"}, "label": "NY Building", "name": "Empire State Building", "type": "Building"}
      });
}