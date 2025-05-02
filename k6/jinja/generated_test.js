import { signup, login } from '../AuthManagement/auth.js';
import { Create_dashboard, Edit_dashboard, get_dashboard, delete_dashboard } from '../DashboardManagement/main.js';
import { create_role, edit_role, delete_role } from '../RoleManagement/main.js';
import { sleep } from 'k6';

const PASSWORD = '123123123';

export let options = {
    stages: [
            { duration: '20s', target: 1 }    ]
};

export default function () {
    const user = signup();
    if (user) {
        const token = login(user.email, PASSWORD);
        if (token) {
                        const DashboardID = Create_dashboard(token);
                        Edit_dashboard(token, DashboardID);
                        get_dashboard(token, DashboardID);
                        delete_dashboard(token, DashboardID);
                        const RoleID = create_role(token);
                        edit_role(token, RoleID);
                        delete_role(token, RoleID);
        }
    }
}