import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-mini';

/**
 * Generated class for the UnixDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'unixDate',
})
export class UnixDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args) {
    return moment.unix( value ).format( args[0] );
  }
}
