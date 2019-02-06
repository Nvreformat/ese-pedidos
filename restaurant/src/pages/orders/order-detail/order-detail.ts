import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MapPage } from './map/map';
import { Util } from '../../../shared/misc/utils';
import { OrderChatPage } from '../../../shared/chat/order-chat';

@Component({
    selector: 'page-order-detail',
    templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
    order: any;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private modalCtrl: ModalController,
    ) {
        this.order = navParams.get('order');
    }

    showMap() {
        this.modalCtrl.create(MapPage, { coords: this.order.location }).present();
    }

    showChat() {
        this.navCtrl.push(OrderChatPage, { order: this.order, isClient: false });
    }
}
