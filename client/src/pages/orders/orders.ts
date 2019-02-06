import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Restaurant, Product, Order } from "../../app/main";
import { OrderDetailPage } from "./detail/order-detail";
import { Util } from "../../shared/misc/utils";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../shared/environment.service";

@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
  })
export class OrdersPage {
    orders: Order[]
    restaurants: Restaurant[]
  
    constructor(
        private navCtrl: NavController,
        private http: HttpClient,
        private env: EnvironmentService,
        private util: Util,
    ) {}

    ngOnInit() {
        this.http.get(this.env.getApiURL('/clients/get_data'), this.env.toAuthHttpParams({orders:"true", restaurants:"true"}))
		.catch((err: HttpErrorResponse) => {
			this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
            this.orders = data["orders"];
            this.restaurants = data["restaurants"];
        })
    }

    restaurantFromId(id: number) : Restaurant {
        let ret: Restaurant

        for (let restaurant of this.restaurants) {
            if (restaurant.id == id)
                ret = restaurant
        }

        return ret
    }

    onClick(order: Order) {
        this.navCtrl.push(OrderDetailPage, {order: order});
    }

    count(order: Order) : number {
        let count: number = 0

        for (let product of order.products) {
            count += product.count
        }

        return count
    }
}