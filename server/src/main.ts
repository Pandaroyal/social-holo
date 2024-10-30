import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
    app.enableCors({
        origin: 'http://localhost:5173', // Allow requests from your Next.js frontend
        methods: 'GET,POST,PUT,DELETE,PATCH', // Define allowed methods
        credentials: true, // If you need to handle cookies/auth headers
    });
    app.use(cookieParser());
    const configService = app.get(ConfigService);

    await app.listen(configService.get('PORT') || 3000);
}

bootstrap();