import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { OrderDetailPage } from './detail/order-detail';
import { OrdersPage } from './orders';

@NgModule({
	declarations: [
		OrdersPage,
    	OrderDetailPage,
	],
	imports: [
		IonicModule,
		SharedModule,
	],
	entryComponents: [
		OrdersPage,
    	OrderDetailPage,
	],
	providers: [],
	exports: []
})
export class OrdersModule {}