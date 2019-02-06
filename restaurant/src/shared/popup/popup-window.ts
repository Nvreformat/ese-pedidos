import { Component, Input } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'popup-window',
  templateUrl: 'popup-window.html',
})
export class PopupWindow {
    _title: string;

    constructor(
        private view: ViewController
    ) {}

    @Input()
    set title(title: string) {
        this._title = title;
    }

    closeModal() {
        this.view.dismiss();
    }
}