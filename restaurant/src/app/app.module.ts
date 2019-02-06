import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { StatsModule } from '../pages/stats/stats.module';
import { LoginModule } from '../pages/login/login.module';
import { MenuModule } from '../pages/menu/menu.module';
import { OrdersModule } from '../pages/orders/orders.module';

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        NgxErrorsModule,
        HttpClientModule,
        HttpModule,
        SharedModule,
        StatsModule,
        LoginModule,
        MenuModule,
        OrdersModule,
        IonicModule.forRoot(MyApp, 
        {
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            scrollPadding: false,
        }),
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

