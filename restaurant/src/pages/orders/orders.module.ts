import { NgModule } from "@angular/core";
import { OrdersPage } from "./orders";
import { OrderDetailPage } from "./order-detail/order-detail";
import { MapPage } from "./order-detail/map/map";
import { OrderItem } from "./order-item/order-item";
import { OrderInfo } from "./order-info/order-info";
import { OrderListPage } from "./order-list/order-list";
import { IonicModule } from "ionic-angular";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
	declarations: [
		OrdersPage,
        OrderDetailPage,
        MapPage,
        OrderItem,
        OrderInfo,
        OrderListPage,
	],
	imports: [
		IonicModule,
		SharedModule,
	],
	entryComponents: [
		OrdersPage,
        OrderDetailPage,
        MapPage,
        OrderItem,
        OrderInfo,
        OrderListPage,
	],
	providers: [],
	exports: []
})
export class OrdersModule {}