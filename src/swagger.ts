import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinic Web Server API',
      version: '1.0.0',
      description: 'API documentation for Clinic Web Server',
      contact: {
        name: 'Clinic Team',
        email: 'support@clinic.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/api/**/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI available at http://localhost:3000/api-docs');
};
