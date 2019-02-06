import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderListPage } from '../orders/order-list/order-list';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../shared/environment.service';

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html',
})
export class StatsPage {
    private stats: any[]

    constructor(
        private navCtrl: NavController,
        private http: HttpClient,
        private env: EnvironmentService,
    ) {}

    ngOnInit() {
        this.http.get(this.env.getApiURL('/restaurants/get_stats'), this.env.toAuthHttpParams())
		.catch((err: HttpErrorResponse) => {
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
            this.stats = data["stats"]
        })
    }

    showHistory() {
        this.navCtrl.push(OrderListPage, { filter: [-1, 2], title: "Order History" });
    }
}
