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
    stages: [
        {
            duration: "5s",
            target: 5
        }    ],
};
 
 
export default function () {
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0dWxveG9rb3JldS03MzEyQHlvcG1haWwuY29tIiwidXNlcklkIjoiMmI0ZGFiNzAtM2NhYi0xMWYwLTk1YzEtNzlkM2I0MzhlNGRmIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxZDZiZjliMi0xZDk0LTQwODItYTg3OC0zZTA2OGE1Njg3N2UiLCJpc3MiOiJpdG9uYS5uZXQiLCJpYXQiOjE3NTE5NjM2ODksImV4cCI6MTc1MTk3MjY4OSwiZmlyc3ROYW1lIjoic3NzIiwibGFzdE5hbWUiOiJzc3MiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiMmFkOWIzZjAtM2NhYi0xMWYwLTk1YzEtNzlkM2I0MzhlNGRmIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCIsImlzU3VwZXJVc2VyIjp0cnVlfQ.ombkvNrB_L6Kg1EtrBZqneigdD4iJeTKCS81PFiGv9YlFQFefYRFLTcuFoLxQtWBFUe56DTUEe2JFwMIi8fqCQ"
 
const fnn = post_abstract_with_payload({
  url: `https://itona.ai/api/device`,
  token: token,
  tag: "fnn",
  job: "fnn",
    payload: {"label": "Room 234 Sensor", "name": +randomString(12), "type": "Temperature Sensor"}
});
console.log('🧪 fnn response:', JSON.stringify(fnn.data));
 
}