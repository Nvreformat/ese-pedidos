import { IonicModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { StatsPage } from "./stats";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	declarations: [
		StatsPage
	],
	imports: [
		IonicModule,
		SharedModule,
	],
	entryComponents: [
		StatsPage
	],
	providers: [],
	exports: []
})
export class StatsModule {}