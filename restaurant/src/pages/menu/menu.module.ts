import { NgModule } from "@angular/core";
import { RestaurantDataModal } from "./data/data";
import { CategoryModal } from "./category/category";
import { ProductModal } from "./product/product";
import { MenuPage } from "./menu";
import { IonicModule } from "ionic-angular";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	declarations: [
        RestaurantDataModal,
        CategoryModal,
        ProductModal,
        MenuPage,
	],
	imports: [
		IonicModule,
		SharedModule,
	],
	entryComponents: [
        RestaurantDataModal,
        CategoryModal,
        ProductModal,
        MenuPage,
	],
	providers: [],
	exports: []
})
export class MenuModule {}