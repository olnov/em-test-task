import { Router } from 'express';
import { UserController } from '@controllers/user.controller';

export const initUserRouter = (controller: UserController): Router => {
  const router = Router();

  router.get('/', (req, res) => {
    controller.getAllUsers(req, res);
    /*  #swagger.tags = ['Users']
        #swagger.summary = 'List users'
        #swagger.description = 'Return all users (without passwords).'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.responses[200] = {
          description: 'Users returned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        firstName: { type: 'string' },
                        middleName: { type: 'string', nullable: true },
                        lastName: { type: 'string' },
                        dateOfBirth: { type: 'string', format: 'date-time' },
                        email: { type: 'string', format: 'email' },
                        userRole: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                      },
                      required: [
                        'id','firstName','lastName','dateOfBirth','email',
                        'userRole','isActive','createdAt','updatedAt'
                      ]
                    }
                  }
                },
                required: ['users']
              },
              examples: {
                success: {
                  value: {
                    users: [
                      {
                        id: '3f2a9a88-0b0c-4a43-8a6f-2e69b1a0a3f2',
                        firstName: 'Alex',
                        middleName: null,
                        lastName: 'Smith',
                        dateOfBirth: '1992-04-15T00:00:00.000Z',
                        email: 'alex.smith@example.com',
                        userRole: 'user',
                        isActive: true,
                        createdAt: '2025-01-15T10:20:30.000Z',
                        updatedAt: '2025-06-01T09:12:45.000Z'
                      },
                      {
                        id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
                        firstName: 'Jordan',
                        middleName: 'A.',
                        lastName: 'Lee',
                        dateOfBirth: '1987-11-02T00:00:00.000Z',
                        email: 'jordan.lee@example.com',
                        userRole: 'admin',
                        isActive: false,
                        createdAt: '2025-02-10T08:00:00.000Z',
                        updatedAt: '2025-05-20T13:45:00.000Z'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[500] = { description: 'Internal server error' }
      */
  });

  router.get('/:id', (req, res) => {
    controller.getUserById(req, res);
    /* #swagger.tags = ['Users']
        #swagger.summary = 'Get user by ID'
        #swagger.description = 'Return a single user by UUID.'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['id'] = {
          in: 'path',
          description: 'User UUID',
          required: true,
          type: 'string',
          example: '6a4ddc5c-f531-4090-a79a-8d89b4b3cb23'
        }
        #swagger.responses[200] = {
          description: 'User returned successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '6a4ddc5c-f531-4090-a79a-8d89b4b3cb23' },
                      email: { type: 'string', example: 'john@example.com' },
                      firstName: { type: 'string', example: 'John' },
                      lastName: { type: 'string', example: 'Doe' },
                      roles: { type: 'array', items: { type: 'string' }, example: ['user'] },
                      isConfirmed: { type: 'boolean', example: true },
                      createdAt: { type: 'string', format: 'date-time', example: '2025-07-01T12:34:56Z' }
                    }
                  }
                }
              },
              examples: {
                success: {
                  value: {
                    user: {
                      id: '6a4ddc5c-f531-4090-a79a-8d89b4b3cb23',
                      email: 'john@example.com',
                      firstName: 'John',
                      lastName: 'Doe',
                      roles: ['user'],
                      isConfirmed: true,
                      createdAt: '2025-07-01T12:34:56Z'
                    }
                  }
                }
              }
            }
          }
        }
        #swagger.responses[400] = {
          description: 'Invalid UUID',
          content: { 'application/json': { examples: { invalid: { value: { message: 'Invalid payload', issues: [{ message: 'Invalid UUID format' }] } } } } }
        }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[404] = { description: 'User not found' }
        #swagger.responses[500] = { description: 'Internal server error' }
      */
  });

  router.patch('/:id/set-role', (req, res) => {
    controller.setUserRole(req, res);
    /* #swagger.tags = ['Users']
        #swagger.summary = 'Set user role'
        #swagger.description = 'Update a user role by UUID.'
        #swagger.security = [{ "BearerAuth": [] }]
        #swagger.parameters['id'] = {
          in: 'path',
          description: 'User UUID',
          required: true,
          type: 'string',
          example: '6a4ddc5c-f531-4090-a79a-8d89b4b3cb23'
        }
        #swagger.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    description: 'Role to set',
                    enum: ['user', 'admin']
                  }
                },
                required: ['role']
              },
              examples: {
                setAdmin: { value: { role: 'admin' } }
              }
            }
          }
        }
        #swagger.responses[200] = {
          description: 'Role updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Role updated' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '6a4ddc5c-f531-4090-a79a-8d89b4b3cb23' },
                      email: { type: 'string', example: 'john@example.com' },
                      roles: { type: 'array', items: { type: 'string' }, example: ['admin'] },
                      updatedAt: { type: 'string', format: 'date-time', example: '2025-09-07T12:00:00Z' }
                    }
                  }
                }
              }
            }
          }
        }
        #swagger.responses[400] = { description: 'Invalid UUID or body' }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[403] = { description: 'Forbidden' }
        #swagger.responses[404] = { description: 'User not found' }
        #swagger.responses[500] = { description: 'Internal server error' }
      */
  });

  return router;
};
