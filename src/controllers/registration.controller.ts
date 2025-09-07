import { UserService } from '@services/user.service';
import { Request, Response } from 'express';
import { RegisterUserDto, RegisterUserSchema } from '@dtos/register-user.dto';
import logger from '@config/logger';

export class RegistrationController {
  constructor(private readonly userService = new UserService()) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const parsed = RegisterUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }

    try {
      const userData: RegisterUserDto = parsed.data;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json({ newUser });
    } catch (error) {
      logger.error(`Error registering user: ${error}`, {
        module: 'RegistrationController',
      });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
