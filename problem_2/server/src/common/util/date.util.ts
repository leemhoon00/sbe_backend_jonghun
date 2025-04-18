export class DateUtil {
  static getLastDateOfMonth(date: string): string {
    const year = Number(date.substring(0, 4));
    const month = Number(date.substring(5, 7));

    const lastDay = new Date(year, month, 0).getDate();
    return `${date.replaceAll('-', '')}${lastDay}`;
  }
}
