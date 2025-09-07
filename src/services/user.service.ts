import {
  User,
  NewUser,
  UserRole,
  UserWithoutPassword,
} from '@models/user.model';
import { UserRepository } from '@repositories/user.repository';
import logger from '@config/logger';
import * as argon2 from 'argon2';

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}

  async createUser(userData: NewUser): Promise<UserWithoutPassword> {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      password,
      userRole = 'user',
    } = userData;

    const passwordHash = await argon2.hash(password);

    try {
      const newUserData: NewUser = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        email: email,
        password: passwordHash,
        userRole: userRole,
      };

      const newUser: User = await this.repository.createUser(newUserData);
      logger.info(`User created successfully. New user id = ${newUser.id}`, {
        module: 'UserService',
      });
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error creating new user', { module: 'UserService' });
        throw new Error('Error creating new user', error);
      }
      logger.error('Error creating new user', { module: 'UserService' });
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserWithoutPassword> {
    const user: User = await this.repository.findById(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<Array<UserWithoutPassword>> {
    const users: Array<User> = await this.repository.findAll();
    return users.map(
      ({ password, ...usersWithoutPasswords }) => usersWithoutPasswords,
    );
  }

  async deactivateUser(id: string): Promise<UserWithoutPassword> {
    const user = await this.repository.findById(id);

    if (!user) {
      logger.warn(`Can't deactivate user. User with id ${id} not found`, {
        module: 'UserService',
      });
      throw new Error(`Can't deactivate user. User with id ${id} not found`);
    }

    try {
      const deactivatedUser = { ...user, isActive: false };
      const updatedUser: User = await this.repository.updateUser(
        id,
        deactivatedUser,
      );
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.warn(`Error deactivating user. ${error}`, {
        module: 'UserService',
      });
      throw error;
    }
  }

  async setUserRole(id: string, role: UserRole): Promise<UserWithoutPassword> {
    const user = await this.repository.findById(id);

    if (!user) {
      logger.warn(
        `Can't change role for the user. User with id ${id} not found`,
        { module: 'UserService' },
      );
      throw new Error(
        `Can't change role for the user. User with id ${id} not found`,
      );
    }

    try {
      const newRole = { ...user, userRole: role };
      const updatedUser: User = await this.repository.updateUser(id, newRole);
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.warn(`Error changing user role. ${error}`, {
        module: 'UserService',
      });
      throw error;
    }
  }
}
