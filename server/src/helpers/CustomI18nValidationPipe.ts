import {
  ArgumentMetadata,
  Injectable,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import {
  I18nContext,
  I18nValidationPipe,
  I18nValidationException,
} from 'nestjs-i18n';

type ErrorObject = {
  property?: string;
  errors?: any[];
};

@Injectable()
export class CustomI18nValidationPipe extends I18nValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (err) {
      if (err instanceof I18nValidationException) {
        const errors = err.errors as ValidationError[];
        const i18n = I18nContext.current();

        const formattedErrors: any[] = [];

        errors.forEach((error: ValidationError) => {
          const errorObject: ErrorObject = {};
          errorObject.property = error.property;

          const constraints = error.constraints as Record<string, string>;
          const constraintsMessages = Object.values(constraints).map((item) =>
            i18n?.t(item),
          );

          errorObject.errors = constraintsMessages;

          formattedErrors.push(errorObject);
        });

        throw new BadRequestException({
          statusCode: 400,
          message: formattedErrors,
          lang: i18n?.lang,
          error: 'Validation Failed',
        });
      }

      throw err;
    }
  }
}
