import { signup, login } from '../AuthManagement/auth.js';
import { createCamera, editCamera, exportToPDF, exportToCSV, deleteCamera } from '../CameraManagement/main.js';
import { sleep } from 'k6';

const PASSWORD = '123123123';

export let options = {
    stages: [
            { duration: '1m', target: 1 }    ]
};

export default function () {
    const user = signup();
    if (user) {
        const token = login(user.email, PASSWORD);


                    const main_workflowID = createCamera(token);

                    editCamera(main_workflowID,token );
                    exportToPDF(token);
                    deleteCamera( main_workflowID,token );
        }
    }
