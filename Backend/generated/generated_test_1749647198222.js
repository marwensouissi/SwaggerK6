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
    { duration: '10s', target: 2 }]
};

export default function () {
const user = signup();
const token = login(user.email, PASSWORD);

const test = post_abstract_with_payload({
url: `https://dev-itona.xyz:443/api/asset`,
        token: token,
        tag: "test",
        job: "test",
          payload: {"label": "NY Building", "name": randomString(10), "type": "Building"}
      });
      const s = get_abstract_without_payload({
        url: `https://dev-itona.xyz:443/api/asset/info/${test.data.id.id}`,
        token: token,
        tag: "s",
        job: "s"
      });
}