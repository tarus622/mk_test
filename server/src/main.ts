import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { CustomI18nValidationPipe } from './helpers/CustomI18nValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new CustomI18nValidationPipe({ whitelist: true, transform: true }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new I18nValidationExceptionFilter(),
    new AllExceptionsFilter(httpAdapter),
  );

  await app.listen(config.get<string>('PORT') ?? 3000);
}
bootstrap();
