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
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/api/**/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

// Thêm type : Express cho biến app
export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('Swagger UI available at http://localhost:3000/api-docs');
    console.log('Swagger JSON available at http://localhost:3000/api-docs.json');
};
