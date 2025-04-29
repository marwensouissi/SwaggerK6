import { signup, login } from '../AuthManagement/auth.js';
import { create_workflow, delete_workflow, edit_workflow } from '../AlertNotificationManagement/main.js';
import { sleep } from 'k6';

const PASSWORD = '123123123';

export let options = {
    stages: [
            { duration: '1m', target: 3 }         ]
};

export default function () {
    const user = signup();
    if (user) {
        const token = login(user.email, PASSWORD);
        if (token) {

            const notifID = create_workflow(token);  // ← Fix: Capture the returned
            edit_workflow(token, notifID);
            delete_workflow(token, notifID);
        }
    }
}