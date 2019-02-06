import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, LoadingController, MenuController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrdersPage } from '../orders/orders';
import { Observable } from 'rxjs';
import { EnvironmentService } from '../../shared/environment.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;

	constructor(
		private navCtrl: NavController,
		private fb: FormBuilder,
		private loadingCtrl: LoadingController,
		private menu: MenuController,
		private http: HttpClient,
		private env: EnvironmentService,
	) {
		this.loginForm = fb.group({
			number: ['6977988551', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")],)],
		});
		this.env.setToken(null)
	}

	ionViewDidEnter() {
		this.menu.swipeEnable(false);
	}
	
	ionViewWillLeave() {
		this.menu.swipeEnable(true);
	}

	verify(value) {
		let loading = this.loadingCtrl.create({
			content: 'Verifying'
		});
		
		loading.present();
		
        this.http.get(this.env.getApiURL('/clients/verify_phone'), this.env.toPlainHttpParams({number:value.number}))
		.catch((err: HttpErrorResponse) => {
			loading.dismiss()
			this.env.makeToastFromError(err)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();
			
			this.env.setToken(data["token"])
			this.navCtrl.setRoot(OrdersPage, {});
        })
	}
}