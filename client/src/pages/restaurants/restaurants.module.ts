import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { RestaurantsPage } from "./restaurants";
import { RestaurantDetailPage } from "./detail/restaurant-detail";
import { RestaurantConfirmPage } from "./detail/confirm/restaurant-confirm";
import { SharedModule } from "../../shared/shared.module";
import { MapPage } from "./detail/confirm/map/map";

@NgModule({
	declarations: [
        RestaurantsPage,
        RestaurantDetailPage,
        RestaurantConfirmPage,
        MapPage,
    ],
	imports: [
        IonicModule,
        SharedModule,
    ],
	providers: [],
	entryComponents: [
        RestaurantsPage,
        RestaurantDetailPage,
        RestaurantConfirmPage,
        MapPage,
    ],
	exports: []
})
export class RestaurantsModule {}