import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Authentication API",
            version: "1.0.0",
            description: "Authentication API built with Node.js, Express, TypeScript, and SQL Server"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);