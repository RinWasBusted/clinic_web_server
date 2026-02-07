import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clinic Web Server API",
            version: "1.0.0",
            description: "API documentation for the Clinic Web Server"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 9999}`,
                description: "Development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>"
                },
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "refreshToken",
                    description: "Refresh token stored in HTTP-only cookie"
                }
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Error message"
                        },
                        errors: {
                            type: "object",
                            description: "Validation errors"
                        }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "User ID"
                        },
                        fullname: {
                            type: "string",
                            description: "Full name of the user"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email address"
                        },
                        role: {
                            type: "string",
                            enum: ["manager", "chemist", "doctor", "patient" ],
                            description: "User role"
                        },
                        isVerified: {
                            type: "boolean",
                            description: "Email verification status"
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: "Authentication",
                description: "API endpoints for user authentication and authorization"
            },
            {
                name: "Users",
                description: "User management endpoints"
            }
        ]
    },
    // Đường dẫn tới các file chứa JSDoc comments
    apis: [
        "./src/features/*/auth.route.ts",
        "./src/features/*/auth.controller.ts",
        "./src/features/**/*.route.ts",
        "./src/features/**/*.controller.ts"
    ]
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Clinic API Documentation",
        customfavIcon: "/favicon.ico"
    }));
    
    // Swagger JSON endpoint
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    
    console.log(`📚 Swagger UI available at http://localhost:${process.env.PORT || 9999}/api-docs`);
}