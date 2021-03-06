import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipetag'
})
export class TagPipe implements PipeTransform {
  constructor() {}

  transform(value: number | string, args: any[]): any {
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
