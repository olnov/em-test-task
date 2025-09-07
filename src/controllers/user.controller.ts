import { UserService } from '@services/user.service';
import { Request, Response } from 'express';
import {
  UserIdDto,
  UserRoleDto,
  UserIdSchema,
  UserRoleSchema,
} from '@dtos/user.dto';
import logger from '@config/logger';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  async setUserRole(req: Request, res: Response): Promise<void> {
    // TODO: Need to add token parsing to check whether a requester is allowed to perform this operation
    try {
      const parsedId = UserIdSchema.safeParse(req.params.id);
      const parsedRole = UserRoleSchema.safeParse(req.body.role);

      if (!parsedId.success) {
        logger.warn('Error parsing Id', { module: 'UserController' });
        res
          .status(400)
          .json({ message: 'Invalid payload', issues: parsedId.error.issues });
        return;
      }

      if (!parsedRole.success) {
        logger.warn('Error parsing Role', { module: 'UserController' });
        res.status(400).json({
          message: 'Invalid payload',
          issues: parsedRole.error.issues,
        });
        return;
      }

      const id: UserIdDto = parsedId.data;
      const role: UserRoleDto = parsedRole.data;

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
      }

      const updatedUser = await this.userService.setUserRole(id, role);
      res.status(200).json({ updatedUser });
    } catch (error) {
      logger.error(`Error updating the user's role. ${error}`, {
        module: 'UserController',
      });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const parsedId = UserIdSchema.safeParse(req.params.id);

      if (!parsedId.success) {
        logger.warn('Error parsing Id', { module: 'UserController' });
        res
          .status(400)
          .json({ message: 'Invalid payload', issues: parsedId.error.issues });
        return;
      }

      const id: UserIdDto = parsedId.data;
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
      res.status(200).json({ user });
    } catch (error) {
      logger.error(`Error retrieving user. ${error}`, {
        module: 'UserController',
      });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      logger.error(`Error retrieving users. ${error}`, {
        module: 'UserController',
      });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
