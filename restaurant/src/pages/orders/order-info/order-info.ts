import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { OrdersPage } from '../orders';
import { Order } from '../../../app/main';
import { Util } from '../../../shared/misc/utils';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../../shared/environment.service';

@Component({
    selector: 'order-info',
    templateUrl: 'order-info.html',
})
export class OrderInfo {
    _order: Order;
    @Output() mapClick = new EventEmitter();
    @Output() discardClick = new EventEmitter();
    @Output() confimClick = new EventEmitter();

    constructor(
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        private util: Util,
        private env: EnvironmentService,
    ) {}

    @Input()
    set order(order: Order) {
        this._order = order;
    }

    onMapClick() {
        this.mapClick.emit();
    }
    
    onDiscardClick() {
        this.discardClick.emit();

        let loading = this.loadingCtrl.create({
			content: 'Cancelling order'
		});
        loading.present();

        this.http.get(this.env.getApiURL('/restaurants/cancel_order'), this.env.toAuthHttpParams({ orderId:("" + this._order.id) }))
		.catch((err: HttpErrorResponse) => {
            loading.dismiss();
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();

			this.navCtrl.setRoot(OrdersPage, {});
        })
    }

    onConfirmClick() {
        this.confimClick.emit();

        let isPending = this.util.isOrderPending(this._order)

        let loading = this.loadingCtrl.create({
			content: (isPending ? 'Confirming' : 'Finishing') + ' order'
		});
        loading.present();

        this.http.get(this.env.getApiURL('/restaurants/' + (isPending ? "confirm_order" : "finish_order")), this.env.toAuthHttpParams({ orderId:("" + this._order.id) }))
		.catch((err: HttpErrorResponse) => {
            loading.dismiss();
			this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();

			this.navCtrl.setRoot(OrdersPage, {});
        })
    }
}