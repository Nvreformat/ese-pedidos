import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map'
import { ProductModal } from './product/product';
import { CategoryModal } from './category/category';
import { Restaurant } from '../../app/main';
import { RestaurantDataModal } from './data/data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../shared/environment.service';
 
@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html'
})
export class MenuPage {
    restaurant: Restaurant;

    constructor(
        private modalCtrl: ModalController,
        private http: HttpClient,
        private env: EnvironmentService,
    ) {
        this.http.get(this.env.getApiURL('/restaurants/get_my_restaurant'), this.env.toAuthHttpParams())
		.catch((err: HttpErrorResponse) => {
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
            this.restaurant = data["restaurant"];
        })
    }
    
    updateData() {
        event.stopPropagation();
        this.modalCtrl.create(RestaurantDataModal, { name: this.restaurant.name, description: this.restaurant.description }, { cssClass: 'inset-modal' }).present();
    }

    toggleSection(i) {
        this.restaurant.menu[i].open = !this.restaurant.menu[i].open;
    }

    editProduct(event: Event, product: any[], productIndex: number) { 
        event.stopPropagation();
        this.modalCtrl.create(ProductModal, { product: product, productIndex: productIndex }, { cssClass: 'inset-modal' }).present();
    }

    editCategory(event: Event, category: any[], categoryIndex: number) {
        event.stopPropagation();
        this.modalCtrl.create(CategoryModal, { category: category }).present();
    }

    addProduct(event: Event, category: any[], categoryIndex: number) {
        event.stopPropagation();
        this.modalCtrl.create(ProductModal, { category: category, categoryIndex: categoryIndex }, { cssClass: 'inset-modal' }).present();
    }

    addCategory(event: Event) {
        event.stopPropagation();
        this.modalCtrl.create(CategoryModal, null, { cssClass: 'inset-modal' }).present();
    }
}



