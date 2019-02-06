import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Order } from "../../../app/main";
import { OrderChatPage } from "../../../shared/chat/order-chat";
import { OrdersPage } from "../orders";
import { Util } from "../../../shared/misc/utils";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../../shared/environment.service";

@Component({
    selector: 'page-order-detail',
    templateUrl: 'order-detail.html',
  })
export class OrderDetailPage {
    order: Order
  
    constructor(
        private navCtrl: NavController,
        private http: HttpClient,
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private env: EnvironmentService,
        private util: Util,
    ) {
        this.order = navParams.get('order');
    }

    showChat() {
        this.navCtrl.push(OrderChatPage, {order: this.order, isClient:true});
    }

    cancelOrder() {
        let loading = this.loadingCtrl.create({
			content: 'Cancelling Order'
		});
        loading.present();

        this.http.get(this.env.getApiURL('/clients/cancel_order'), this.env.toAuthHttpParams({ orderId:("" + this.order.id) }))
		.catch((err: HttpErrorResponse) => {
            loading.dismiss()
			this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();

			this.navCtrl.setRoot(OrdersPage, {});
        })
    }
}