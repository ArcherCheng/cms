import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tag'
})
export class TagPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!args.length) {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value;
    }

    const v = args.filter(item => {
      return item.id === value;
    });

    if (!v.length) {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value;
    }

    return v[0].name;
  }
}
