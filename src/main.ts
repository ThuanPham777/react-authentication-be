import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // 400 if unknown provided
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN') || true,
    credentials: true,
  });

  // Memory monitoring (every 5 minutes in production)
  if (process.env.NODE_ENV === 'production') {
    setInterval(
      () => {
        const used = process.memoryUsage();
        const heapMB = Math.round(used.heapUsed / 1024 / 1024);
        const totalMB = Math.round(used.heapTotal / 1024 / 1024);
        console.log(`[Memory] Heap: ${heapMB}MB / ${totalMB}MB`);

        // Warning if approaching limit
        if (heapMB > 600) {
          console.warn(`[Memory] WARNING: High memory usage: ${heapMB}MB`);
        }
      },
      5 * 60 * 1000,
    );
  }

  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Log initial memory
  const initial = process.memoryUsage();
  console.log(`Initial heap: ${Math.round(initial.heapUsed / 1024 / 1024)}MB`);
}
bootstrap();
