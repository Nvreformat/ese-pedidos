import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, ViewController, LoadingController, App } from "ionic-angular";
import { MenuPage } from "../menu";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../../shared/environment.service";

@Component({
    selector: 'page-product',
    templateUrl: 'product.html'
})
export class ProductModal {
    product: any;
    category: any
    productForm: FormGroup;
    
    constructor(
        private fb: FormBuilder,
        private navParams: NavParams,
        private http: HttpClient,
        private loadingCtrl: LoadingController,
        private view: ViewController,
        private app: App,
        private env: EnvironmentService,
    ) {
        this.product = navParams.get("product");
        this.category = navParams.get("category");
        this.productForm = fb.group({
            name: [this.product ? this.product.name : '', Validators.compose([Validators.required])],
            description: [this.product ? this.product.description : ''],
            price: [this.product ? this.product.price : '', Validators.compose([Validators.required, Validators.min(1)])],
        });
    }
    
    closeModal() {
        this.view.dismiss();
    }
    
    onEditOrCreateProduct(remove){
        let loading = this.loadingCtrl.create({
			content: 'Loading'
		});

        let data = this.productForm.value

        if (this.product)
            data["id"] = this.product.id + ""
        else
            data["category"] = this.category.id + ""

        if (remove)
            data["remove"] = "true"

        data["price"] += ""

		loading.present();

        this.http.get(this.env.getApiURL('/restaurants/add_update_product'), this.env.toAuthHttpParams(data))
		.catch((err: HttpErrorResponse) => {
			loading.dismiss();
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        }).subscribe(data => {
			loading.dismiss();

            this.view.dismiss().then(() => {
                this.app.getRootNav().setRoot(MenuPage);
            });
        })
    }
}