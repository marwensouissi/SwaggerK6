import {
get_abstract_with_payload,
get_abstract_without_payload,
post_abstract_with_payload,
patch_abstract_with_payload,
delete_abstract_without_payload,
put_abstract_with_payload
} from '../../k6/utils/abstract.js';
import { signup, login } from '../../k6/AuthManagement/auth.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
 
const PASSWORD = "123123123";
 
export let options = {
    stages: [
        {
            duration: "2s",
            target: 2
        }    ],
};
 
 
export default function () {

let token;

const user = signup();
token = login(user.email, PASSWORD);
console.log("🔐 Token acquired via signup/login.");

 
const ff = get_abstract_without_payload({
  url: `https://dev-itona.xyz:443/api/admin/autoCommitSettings`,
  token: token,
  tag: "ff",
  job: "ff"
});
console.log('🧪 ff response:', JSON.stringify(ff.data));
 
}