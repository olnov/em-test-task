import { User, NewUser } from "@/db/schema";
import { UserRepository } from "@/repositories/user.repository";
import logger from '@config/logger';
import * as argon2 from "argon2";

export class UserService {

    constructor (
        private readonly repository = new UserRepository(),
    ) {}

    async createUser (userData: NewUser): Promise<Partial<User>> {
        const { firstName, middleName, lastName, dateOfBirth, email, password, userRole = 'user'} = userData;

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
            }

            const newUser: Partial<User> = await this.repository.createUser(newUserData);
            delete newUser.password;
            logger.info(`User created successfully. New user id = ${newUser.id}`, {module: 'UserService'});
            return newUser;

        } catch(error) {
            if (error instanceof Error) {
                logger.error('Error creating new user', { module: 'UserService'});
                throw new Error('Error creating new user', error);
            }
            logger.error('Error creating new user', { module: 'UserService'});
            throw error;
        }
    }

    async getUserById(id: string): Promise<Partial<User>> {
        const user: Partial<User> = await this.repository.findById(id);
        delete user.password;
        return user;
    }

    async getAllUsers(): Promise<Array<Partial<User>>> {
        const users:Array<Partial<User>> =  await this.repository.findAll();
        return users.map(user =>{
            delete user.password;
            return user;
        })
    }

    async deactivateUser(id: string): Promise<Partial<User>> {
        const user = await this.repository.findById(id);

        if(!user) {
            logger.warn(`Can't deactivate user. User with id ${id} not found`, {module: 'UserService'});
            throw new Error(`Can't deactivate user. User with id ${id} not found`);
        }

        try {
            const deactivatedUser = {...user, isActive:false };
            const updatedUser: Partial<User> = await this.repository.updateUser(id, deactivatedUser);
            delete updatedUser.password;
            return updatedUser;
        }catch(error){
            logger.warn(`Error deactivating user. ${error}`, { module:'UserService' });
            throw error;
        }
    }

    async grantAdmin(id: string): Promise<Partial<User>> {
        const user = await this.repository.findById(id);

        if(!user) {
            logger.warn(`Can't grant admin rights to the user. User with id ${id} not found`, {module: 'UserService'});
            throw new Error(`Can't grant admin rights to the user ${id} not found`);
        }

        try {
            const adminUser = {...user, userRole:'admin' as const};
            const updatedUser: Partial<User> = await this.repository.updateUser(id, adminUser);
            delete updatedUser.password;
            return updatedUser;
        }catch(error){
            logger.warn(`Error changing user role. ${error}`, { module:'UserService' });
            throw error;
        }
    }

}