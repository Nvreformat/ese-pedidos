import { Component } from '@angular/core';
import { App, NavParams } from 'ionic-angular';
import { OrderDetailPage } from '../order-detail/order-detail';
import { Restaurant, Order } from '../../../app/main';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../../shared/environment.service';

@Component({
    selector: 'order-list',
    templateUrl: 'order-list.html',
})
export class OrderListPage {
    orders: Order[]
    restaurant: Restaurant
    filter: number;
    title: string

    constructor(
        private http: HttpClient,
        private navParams: NavParams,
        private appCtrl: App,
        private env: EnvironmentService,
    ) {
        this.filter = navParams.get("filter");
        this.title = navParams.get("title");
    }

    ngOnInit() {
        this.http.get(this.env.getApiURL('/restaurants/get_orders'), this.env.toAuthHttpParams({orderType: JSON.stringify(this.filter)}))
		.catch((err: HttpErrorResponse) => {
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
            this.orders = data["orders"];
            this.restaurant = data["restaurant"];
        })
    }

    onClick(order) {
        this.appCtrl.getRootNav().push(OrderDetailPage, {order});
    }

    isFirstOrderOfTheMonth(order: Order) : boolean {
        let index = this.orders.indexOf(order)

        if (index < 1)
            return false

        let date1 = new Date(order.date * 1000)
        let date2 = new Date(this.orders[index - 1].date * 1000)

        return date1.getMonth() != date2.getMonth()
    }
}