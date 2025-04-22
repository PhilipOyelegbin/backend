import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupRedoc } from './middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:3030',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // setting up swagger ui and redoc documentation
  const options = new DocumentBuilder()
    .setTitle('Silo Digital Wallet API')
    .setDescription(
      'Silo Digital Wallet app is a seamless and secure platform designed to revolutionize the way you manage and interact with your finances. Built with cutting-edge technology, the app addresses the need for convenient, fast, and reliable international transactions while solving key financial accessibility and security challenges. The app eliminates the dependency on cash, reduces the risk of theft or fraud, and provides financial services to underbanked or unbanked individuals. It simplifies complex financial processes like forex rates, conversion, and multi-currency transactions, all while ensuring top-notch security and usability. With its intuitive design, users save time and effort, enabling them to focus on what matters most—living their best lives.',
    )
    .setContact('Philip Oyelegbin', '', 'info@philipoyelegbin.com.ng')
    .setExternalDoc('Redoc Documenation', '/docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document, {
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  // Expose Swagger JSON at `/api-json`
  app.use('/api-json', (req: any, res: any) => {
    res.json(document);
  });

  // Set up ReDoc at `/docs`
  setupRedoc(app as any);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
