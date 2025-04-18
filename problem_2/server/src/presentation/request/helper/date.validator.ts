import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsYYYYMMOrYYYYMMDD(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isYYYYMMOrYYYYMMDD',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // YYYYMMDD (8자리) 또는 YYYYMM (6자리) 형식 확인
          if (value.length !== 6 && value.length !== 8) return false;

          // 실제 유효한 날짜인지 확인
          try {
            const year = Number(value.substring(0, 4));
            const month = Number(value.substring(4, 6));
            const day = value.length === 8 ? Number(value.substring(6, 8)) : 1;

            // JavaScript에서 월은 0부터 시작하므로 -1
            const date = new Date(year, month - 1, day);

            // 날짜가 유효한지 확인
            return (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              (value.length === 6 || date.getDate() === day)
            );
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property}는 YYYYMMDD 또는 YYYYMM 형식이어야 합니다.`;
        },
      },
    });
  };
}
