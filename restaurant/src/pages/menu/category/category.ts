import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavParams, ViewController, LoadingController, App } from "ionic-angular";
import { MenuPage } from "../menu";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvironmentService } from "../../../shared/environment.service";

@Component({
    selector: 'page-category',
    templateUrl: 'category.html'
})
export class CategoryModal {
    category: any;
    categoryForm: FormGroup;
  
    constructor(
        private fb: FormBuilder,
        private navParams: NavParams,
        private http: HttpClient,
        private view: ViewController,
        private loadingCtrl: LoadingController,
        private app: App,
        private env: EnvironmentService,
    ) {
        this.category = navParams.get("category");
        this.categoryForm = fb.group({
            name: [this.category ? this.category.name : '', Validators.compose([Validators.required])]
        });
    }
  
    closeModal() {
        this.view.dismiss();
    }
  
    onEditOrCreateCategory(remove){
        let loading = this.loadingCtrl.create({
			content: 'Loading'
		});

        let data = this.categoryForm.value

        if (this.category)
            data["id"] = this.category.id + ""

        if (remove)
            data["remove"] = "true"

		loading.present();
        this.http.get(this.env.getApiURL('/restaurants/add_update_category'), this.env.toAuthHttpParams(data))
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