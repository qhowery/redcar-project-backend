import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'https://redcar-project.vercel.app',
      'http://localhost:3000',
<<<<<<< HEAD
      'https://redcar-project-mhckh6wtk-qhowerys-projects.vercel.app'
=======
      'https://redcar-project-mhckh6wtk-qhowerys-projects.vercel.app/'
>>>>>>> 2b326062118a9d77ddf802dcc2f603f23383fc31
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}

// Initialize NestJS app with Express
bootstrap();

// Export server for Vercel compatibility
export default server;
