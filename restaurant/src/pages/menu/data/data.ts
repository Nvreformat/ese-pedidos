import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, ViewController, LoadingController, App } from "ionic-angular";
import { MenuPage } from "../menu";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../../shared/environment.service";

@Component({
    selector: 'page-restaurant-data',
    templateUrl: 'data.html'
})
export class RestaurantDataModal {
    dataForm: FormGroup;
    
    constructor(
        private fb: FormBuilder,
        private navParams: NavParams,
        private http: HttpClient,
        private loadingCtrl: LoadingController,
        private view: ViewController,
        private app: App,
        private env: EnvironmentService,
    ) {
        this.dataForm = fb.group({
            name: [navParams.get("name"), Validators.compose([Validators.required])],
            description: [navParams.get("description"), Validators.compose([Validators.required])],
        });
    }
    
    closeModal() {
        this.view.dismiss();
    }
    
    onUpdateProfile() {
        let loading = this.loadingCtrl.create({
			content: 'Loading'
		});

        let data = this.dataForm.value

		loading.present();

        this.http.get(this.env.getApiURL('/restaurants/update_profile'), this.env.toAuthHttpParams(data))
		.catch((err: HttpErrorResponse) => {
			loading.dismiss();
            this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();

			this.view.dismiss().then(() => {
                this.app.getRootNav().setRoot(MenuPage);
            });
        })
    }
}