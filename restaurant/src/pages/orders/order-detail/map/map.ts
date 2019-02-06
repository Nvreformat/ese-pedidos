import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {
    map: any;
    coords: any[];

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController,
    ) {
        this.coords = navParams.get('coords');
    }

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap() {
        let mapEle: HTMLElement = document.getElementById('map');
        let pos = {lat: this.coords[0], lng: this.coords[1]};

        this.map = new google.maps.Map(mapEle, {
            center: pos,
            zoom: 16,
            disableDefaultUI: true,
        });

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            let marker = new google.maps.Marker({
                position: pos,
                map: this.map,
                title: 'Client'
            });
            mapEle.classList.add('show-map');
        });
    }
}
