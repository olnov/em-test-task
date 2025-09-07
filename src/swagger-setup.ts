import express from 'express';
import { initRegistrationRouter } from '@routes/registration.route';
import { initUserRouter } from '@routes/user.route';
import { RegistrationController } from '@controllers/registration.controller';
import { UserController } from '@controllers/user.controller';

const app = express();

const registrationController = new RegistrationController();
const userController = new UserController();

app.use('/api/v1/register', initRegistrationRouter(registrationController)
    // #swagger.tags = ['Registration']
);
app.use('/api/v1/users', initUserRouter(userController)
    // #swagger.tags = ['Users']
);


export default app;