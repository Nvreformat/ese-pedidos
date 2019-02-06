import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { EnvironmentService } from '../environment.service';
 
@Injectable()
export class ChatService {
    public onMessage: Observable<Object>

    constructor(
        private socket: Socket,
        private env: EnvironmentService,
    ) {
        this.onMessage = Observable.create(( observer : Observer<Object> ) => {
            this.socket.on('push_messages', (data) => {
                observer.next(data);
            });
        });

        this.socket.on('connect', (data) => {
            this.socket.emit("login", this.env.getToken());
        });

        this.socket.connect()
    }

    sendMessage(orderId: number, message: string) {
        this.socket.emit("send_message", {orderId: orderId, message: message});
    }

    fetchMessages(orderId: number) {
        this.socket.emit("get_messages", orderId)
    }
}