import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, LoadingController, MenuController } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { EnvironmentService } from '../../shared/environment.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;
	loginError: string;

	constructor(
		private navCtrl: NavController,
		private fb: FormBuilder,
		private loadingCtrl: LoadingController,
		private http: HttpClient,
		private menu: MenuController,
		private env: EnvironmentService,
	) {
		this.loginForm = fb.group({
			username: ['restaurant1', Validators.compose([Validators.required])],
			password: ['restaurant1', Validators.compose([Validators.required])]
		});

		this.env.setToken(null)
	}

	ionViewDidEnter() {
		this.menu.swipeEnable(false);
	}
	
	ionViewWillLeave() {
		this.menu.swipeEnable(true);
	}

	login(value: any[]) {
		let loading = this.loadingCtrl.create({
			content: 'Logging in'
		});

		loading.present();
		this.http.get(this.env.getApiURL('/restaurants/auth'), this.env.toPlainHttpParams(this.loginForm.value))
		.catch((err: HttpErrorResponse) => {
			loading.dismiss();

			let message = this.env.getDefaultErrorMessage(err)
			
			if (err.status == 401)
				message = "Please check the username or password"

			this.env.makeToast(message)

            return Observable.empty<Object>();
        })
        .subscribe(data => {
			loading.dismiss();
			
			this.env.setToken(data["token"])
			this.navCtrl.setRoot(OrdersPage, {});
		})
		
	}
}