require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Debug: Check if .env is loaded (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Environment check:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
  console.log('   PORT:', process.env.PORT || '3000 (default)');
}

// MongoDB connection middleware - ensures connection on first API request
const ensureDB = async (req, res, next) => {
  try {
    // This will use cached connection if available
    await connectDB();
  } catch (err) {
    // Don't block request if connection fails - routes will handle it
    console.error('DB connection attempt failed:', err.message);
  }
  next();
};

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing tasks with MongoDB and Express.js',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      },
      {
        url: 'https://task20-one.vercel.app',
        description: 'Production Server'
      }
    ],
    tags: [
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Users',
        description: 'User-related endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoint'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Complete project' },
            description: { type: 'string', example: 'Finish API documentation' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
            completed: { type: 'boolean', example: false },
            dueDate: { type: 'string', format: 'date-time' },
            assignedTo: { type: 'string', example: '507f1f77bcf86cd799439012' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            name: { type: 'string', example: 'Cha Eunwoo' },
            email: { type: 'string', example: 'eunwoo@gmail.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

// Swagger setup - using CDN for better serverless compatibility
let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  // Swagger JSON endpoint (for Swagger UI to load)
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // Swagger UI - serve from CDN (works better in serverless)
  app.get('/api-docs', (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Management API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: window.location.origin + '/api-docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null
      });
    };
  </script>
</body>
</html>`;
    res.send(html);
  });
  
  // Also try standard Swagger UI setup as fallback
  app.use('/api-docs-swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
} catch (err) {
  console.error('Swagger setup error:', err.message);
  // Fallback endpoint
  app.get('/api-docs', (req, res) => {
    res.json({ error: 'Swagger documentation unavailable', message: err.message });
  });
}

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow Swagger UI to work
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route - Welcome message with API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Task Management API',
    version: '1.0.0',
    endpoints: {
      documentation: '/api-docs',
      health: '/health',
      tasks: '/api/v1/tasks',
      users: '/api/v1/users'
    },
    status: 'Server is running'
  });
});

// API Routes - ensure DB connection on first request
app.use('/api/v1/tasks', ensureDB, require('./routes/taskRoutes'));
app.use('/api/v1/users', ensureDB, require('./routes/userRoutes'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'Server is running'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'Please provide a valid ID'
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      message: 'This record already exists'
    });
  }
  
  // MongoDB connection error
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseError') {
    return res.status(503).json({
      success: false,
      error: 'Database connection error',
      message: 'Unable to connect to database. Please try again later.'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

// Only listen if not in Vercel serverless environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
}

// Export for Vercel serverless
module.exports = app;