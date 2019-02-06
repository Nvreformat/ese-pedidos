import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-item',
  templateUrl: 'order-item.html',
})
export class OrderItem {
    _order: any[];

    constructor() {}

    @Input()
    set order(order: any[]) {
        this._order = order;
    }

    getMinutesString(minutes) : string {
        if (minutes < 2)
            return "Right now"
        else
            return minutes + " minutes ago"
    }
}