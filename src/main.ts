import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    
  // Enable CORS with custom options
    app.enableCors({
      origin: ['http://localhost:3000', 'http://another-allowed-origin.com'],
      methods: 'GET, POST, PUT, DELETE',  // Allowed HTTP methods
      allowedHeaders: 'Content-Type, Authorization', // Allowed headers
      credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
    });

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
