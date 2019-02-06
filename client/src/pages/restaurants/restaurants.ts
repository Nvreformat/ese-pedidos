import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantDetailPage } from './detail/restaurant-detail';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../shared/environment.service';

@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {
    restaurants: any[]

	constructor(
		private navCtrl: NavController,
        private http: HttpClient,
        private env: EnvironmentService,
	) {}

    ngOnInit() {
        this.http.get(this.env.getApiURL('/clients/get_data'), this.env.toAuthHttpParams({restaurants:"true"}))
		.catch((err: HttpErrorResponse) => {
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
            this.restaurants = data["restaurants"];
        })
    }
    
    onClick(restaurant) {
        this.navCtrl.push(RestaurantDetailPage, {restaurant: restaurant});
    }
}