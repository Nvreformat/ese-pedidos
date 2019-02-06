import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { SharedModule } from '../shared/shared.module';
import { OrdersModule } from '../pages/orders/orders.module'
import { HttpClientModule } from '@angular/common/http';
import { RestaurantsModule } from '../pages/restaurants/restaurants.module';
import { LoginModule } from '../pages/login/login.module';

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NgxErrorsModule,
        HttpModule,
        HttpClientModule,
        SharedModule,
        OrdersModule,
        RestaurantsModule,
        LoginModule,
        IonicModule.forRoot(MyApp, { scrollPadding: false }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        HttpModule,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
