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
 
 
export let options = {
    stages: 
        {
            iteration: "1000",
            vus: 1000

}};
 
 
export default function () {
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0dWxveG9rb3JldS03MzEyQHlvcG1haWwuY29tIiwidXNlcklkIjoiMmI0ZGFiNzAtM2NhYi0xMWYwLTk1YzEtNzlkM2I0MzhlNGRmIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxZTI1ZGRmMS1iZDdiLTQ4OGUtOTViZC1jZTQ0MGYwNTk4NjgiLCJpc3MiOiJpdG9uYS5uZXQiLCJpYXQiOjE3NTI0OTg5MjgsImV4cCI6MTc1MjUwNzkyOCwiZmlyc3ROYW1lIjoic3NzIiwibGFzdE5hbWUiOiJzc3MiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMmFkOWIzZjAtM2NhYi0xMWYwLTk1YzEtNzlkM2I0MzhlNGRmIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.9iBqecwGeUliVV1yzXnuOkxOE4sO1qX4Z069RNUAHvmZtLG1a79f2pdbwxUpTaMQvHl8UM0WLxv9F8FcPn5jLw"
     const testName = `testmqt-${randomString(7)}`;

const dz = post_abstract_with_payload({
  url: `https://itona.ai/api/device`,
  token: token,
  tag: "dz",
    payload: {"label": "Room 234 Sensor", "name": testName , "type": "Temperature Sensor"}
});
console.log('🧪 dz response:', JSON.stringify(dz.data));
 
} 