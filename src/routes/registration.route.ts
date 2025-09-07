import { Router } from 'express';
import { RegistrationController } from '@controllers/registration.controller';

export const initRegistrationRouter = (
  controller: RegistrationController,
): Router => {
  const router = Router();

  router.post(
    '/',
    (req, res) => controller.registerUser(req, res),
    // #swagger.tags = ['Registration']
  );

  return router;
};
