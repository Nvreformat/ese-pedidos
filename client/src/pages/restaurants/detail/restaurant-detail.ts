import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Restaurant } from '../../../app/main';
import { RestaurantConfirmPage } from './confirm/restaurant-confirm';

@Component({
  selector: 'page-restaurant-detail',
  templateUrl: 'restaurant-detail.html',
})
export class RestaurantDetailPage {
    restaurant: Restaurant
    productCount: number = 0

	constructor(
		private navCtrl: NavController,
        private navParams: NavParams,
	) {}

    ngOnInit() {
        this.restaurant = this.navParams.get('restaurant');

        // Reset product count
        for (let category of this.restaurant.menu) {
            category.open = true

            for (let product of category.products)
                product.count = 0;
        }

        this.productCount = 0
    }
    
    toggleSection(i) {
        this.restaurant.menu[i].open = !this.restaurant.menu[i].open;
    }

    add(categoryIndex, productIndex) {
        if (this.restaurant.menu[categoryIndex].products[productIndex].count === undefined) 
            this.restaurant.menu[categoryIndex].products[productIndex].count = 0
        
        this.restaurant.menu[categoryIndex].products[productIndex].count++
        this.productCount++
    }

    remove(categoryIndex, productIndex) {
        this.restaurant.menu[categoryIndex].products[productIndex].count = this.restaurant.menu[categoryIndex].products[productIndex].count - 1
        this.productCount--
    }

    next() {
        this.navCtrl.push(RestaurantConfirmPage, {restaurant: this.restaurant});
    }
}
