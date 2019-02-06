import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatsPage } from '../pages/stats/stats';
import { MenuPage } from '../pages/menu/menu';
import { OrdersPage } from '../pages/orders/orders';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage = LoginPage;
    pages: Array<{title: string, component: any, icon: any}>;

    constructor(
        public platform: Platform,
        public menu: MenuController,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen
    ) {
        this.initializeApp();

        this.pages = [
            { title: 'My Restaurant', component: MenuPage, icon: "restaurant" },
            { title: 'Orders', component: OrdersPage, icon: "cube" },
            { title: 'Statistics', component: StatsPage, icon: "stats" },
            { title: 'Logout', component: LoginPage, icon: "log-out" }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        this.menu.close();
        this.nav.setRoot(page.component);
    }
}
