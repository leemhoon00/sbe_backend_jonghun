import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // YYYY-MM-DD (10자리) 또는 YYYY-MM (7자리) 형식 확인
          if (value.length !== 10 && value.length !== 7) return false;

          // 실제 유효한 날짜인지 확인
          try {
            const year = Number(value.substring(0, 4));
            const month = Number(value.substring(5, 7));
            const day = value.length === 10 ? Number(value.substring(8)) : 1;

            // JavaScript에서 월은 0부터 시작하므로 -1
            const date = new Date(year, month - 1, day);

            // 날짜가 유효한지 확인
            return (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              (value.length === 7 || date.getDate() === day)
            );
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}는 YYYY-MM-DD 또는 YYYY-MM 형식이어야 합니다.`;
        },
      },
    });
  };
}
