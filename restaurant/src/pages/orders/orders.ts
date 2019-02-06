import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderListPage } from './order-list/order-list';

@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
})
export class OrdersPage {
    tab1Root = OrderListPage;
    tab2Root = OrderListPage;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) {}
}
