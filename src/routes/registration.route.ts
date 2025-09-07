import { Router } from 'express';
import { RegistrationController } from '@controllers/registration.controller';

const router = Router();

router.post('/', (req, res) => {
  const registrationController = new RegistrationController();
  return registrationController.registerUser(req, res);
});

export default router;