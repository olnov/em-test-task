import { Router } from 'express';
import { RegistrationController } from '@controllers/registration.controller';

export const initRegistrationRouter = (
  controller: RegistrationController,
): Router => {
  const router = Router();

  router.post('/', (req, res) => controller.registerUser(req, res),
    /*
    #swagger.tags = ['Registration']
    #swagger.summary = 'User registration'
    #swagger.description = 'Registers new users in the system'
    
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'John' },
              middleName: { type: 'string', example: 'Michael' },
              lastName: { type: 'string', example: 'Doe' },
              dateOfBirth: { type: 'string', example: '27.10.1995' },
              email: { type: 'string', example: 'john.doe@example.com' },
              password: { type: 'string', example: 'SecurePassword123!' },
              userRole: { type: 'string', example: 'user' }
            },
            required: ['firstName', 'lastName', 'dateOfBirth', 'email', 'password', 'userRole']
          }
        }
      }
    }
    
    #swagger.responses[201] = {
      description: 'User successfully registered',
      content: {
        'application/json': {
          example: { 
            newUser: {
              id: '507f1f77bcf86cd799439011',
              firstName: 'John',
              middleName: 'Michael',
              lastName: 'Doe',
              dateOfBirth: '27.10.1995',
              email: 'john.doe@example.com',
              userRole: 'user',
              createdAt: '2024-01-15T10:30:00.000Z'
            }
          }
        }
      }
    }
    
    #swagger.responses[400] = {
      description: 'Invalid input data',
      content: {
        'application/json': {
          example: {
            message: 'Invalid payload',
            issues: [
              {
                code: 'invalid_type',
                expected: 'string',
                received: 'undefined',
                path: ['firstName'],
                message: 'Required'
              }
            ]
          }
        }
      }
    }
    
    #swagger.responses[500] = {
      description: 'Internal server error',
      content: {
        'application/json': {
          example: {
            message: 'Internal server error'
          }
        }
      }
    }
    */
  );

  return router;
};