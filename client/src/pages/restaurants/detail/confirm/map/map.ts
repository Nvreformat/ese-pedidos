import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {
    map: any;
    marker: any;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
    ) {}

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap() {
        let mapEle: HTMLElement = document.getElementById('map');
        let myLatLng = {lat: -26.7865, lng: -60.4393};

        this.map = new google.maps.Map(mapEle, {
            center: myLatLng,
            zoom: 16,
            disableDefaultUI: true,
        });

        google.maps.event.addListener(this.map, 'click', ( (event) => {
            this.updateMarker(event.latLng)
        } ))

        let coords = this.navParams.get('coords');

        if (coords)
            this.updateMarker(coords)
    }

    updateMarker(latLng) {
        if (this.marker == null) {
            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
            });
        }
        else
            this.marker.setPosition(latLng)
    }

    selectLocation() {
        this.viewCtrl.dismiss(this.marker.getPosition());
    }
}
