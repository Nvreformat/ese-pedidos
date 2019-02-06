import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController, ModalController, Modal } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Restaurant } from "../../../../app/main";
import { OrdersPage } from "../../../orders/orders";
import { Observable } from "rxjs";
import { MapPage } from "./map/map";
import { EnvironmentService } from "../../../../shared/environment.service";

@Component({
    selector: 'page-restaurant-confirm',
    templateUrl: 'restaurant-confirm.html',
  })
export class RestaurantConfirmPage {
    restaurant: Restaurant
    orderList: any[] = []
    order: any
    coords: any
    totalPrice: number = 0
    confirmForm: FormGroup;

    constructor(
        private navCtrl: NavController,
        private fb: FormBuilder,
        private http: HttpClient,
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private env: EnvironmentService,
    ) {}

    ngOnInit() {
        this.restaurant = this.navParams.get('restaurant');

        this.confirmForm = this.fb.group({
            address: ['', Validators.compose([Validators.required])],
            comments: [''],
		});

        for (let category of this.restaurant.menu) {
            for (let product of category.products) {
                if (product.count && product.count > 0) {
                    this.orderList.push(product);
                    this.totalPrice = this.totalPrice + (product.price * product.count)
                }
            }
        }

        this.order = {products: this.orderList, price: this.totalPrice}
    }

    getProducts() : any[] {
        let ret: any[] = []

        for (let product of this.orderList) {
            let prod = {}

            prod["id"] = product.id
            prod["count"] = product.count
            
            ret.push(prod)
        }

        return ret
    }
    
    makeOrder(value)
    {
        let loading = this.loadingCtrl.create({
			content: 'Placing Order'
		});
        loading.present();

        let order = {
            restaurantId: "" + this.restaurant.id,
            address: value.address,
            comments: value.comments,
            coords: JSON.stringify([this.coords.lat(), this.coords.lng()]),
            products: JSON.stringify(this.getProducts()),
        }

        this.http.get(this.env.getApiURL('/clients/create_order'), this.env.toAuthHttpParams(order))
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

    getLocation() {
        const modal: Modal = this.modalCtrl.create(MapPage, { coords: this.coords });

        modal.onDidDismiss(data => {
            this.coords = data
        })

        modal.present();
    }
  }