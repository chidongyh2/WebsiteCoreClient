import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class DateFormatHelper extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && Number(dateParts[0])) {
        return { day: Number(dateParts[0]), month: null, year: null };
      } else if (dateParts.length === 2 && Number(dateParts[0]) && Number(dateParts[1])) {
        return { day: Number(dateParts[0]), month: Number(dateParts[1]), year: null };
      } else if (dateParts.length === 3 && Number(dateParts[0]) && Number(dateParts[1]) && Number(dateParts[2])) {
        return { day: Number(dateParts[0]), month: Number(dateParts[1]), year: Number(dateParts[2]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
      `${(Number(date.day) < 10 ? '0' : '') + date.day}/${(Number(date.month) < 10  ? '0' : '') + date.month}/${Number(date.year)}` :
      '';
  }
}