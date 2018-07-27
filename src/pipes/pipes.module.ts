import { NgModule } from '@angular/core';
import { UnixDatePipe } from './unix-date/unix-date';
@NgModule({
	declarations: [UnixDatePipe],
	imports: [],
	exports: [UnixDatePipe]
})
export class PipesModule {}
