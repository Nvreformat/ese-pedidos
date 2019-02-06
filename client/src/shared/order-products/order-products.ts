import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-products',
  templateUrl: 'order-products.html',
})
export class OrderProducts {
    _order: any[];

    constructor() {}

    @Input()
    set order(order: any[]) {
        this._order = order
    }
}