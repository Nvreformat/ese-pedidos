import { Injectable } from "@angular/core";

@Injectable()
export class Util {
    public orderStatusToDescription(status) : string {
        if (status == -1)
            return "Cancelled"
        else if (status == 0)
            return "Pending"
        else if (status == 1)
            return "Confirmed"
        else if (status == 2)
            return "Finished"
    }

    public orderStatusToColor(status) : string {
        if (status == -1)
            return "red"
        else if (status == 0)
            return "orangered"
        else if (status == 1)
            return "green"
        else if (status == 2)
            return "gray"
    }

    public isOrderCancellable(order) : boolean {
        return order.status == 1 || order.status == 0
    }

    public isOrderDone(order) : boolean {
        return order.status == 2 || order.status == -1
    }

    public isOrderCanceled(order) : boolean { return order.status == -1 }
    public isOrderPending(order) : boolean { return order.status == 0 }
    public isOrderConfirmed(order) : boolean { return order.status == 1 }
    public isOrderFinished(order) : boolean { return order.status == 2 }
}