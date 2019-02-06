import { NgModule } from "@angular/core";
import { LoginPage } from "./login";
import { IonicModule } from "ionic-angular";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	declarations: [
		LoginPage
	],
	imports: [
		IonicModule,
		SharedModule,
	],
	entryComponents: [
		LoginPage
	],
	providers: [],
	exports: []
})
export class LoginModule {}