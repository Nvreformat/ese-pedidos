import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavParams } from "ionic-angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Order } from "../../app/main";
import { ChatService } from "./chat-service";
import { Util } from "../misc/utils";

@Component({
    selector: 'page-order-chat',
    templateUrl: 'order-chat.html',
  })
export class OrderChatPage {
    order: Order
    messages: any[]
    chatForm: FormGroup;
    isClient: boolean = false;
    @ViewChild("chatWindow") chatView: ElementRef;
  
    constructor(
        private navParams: NavParams,
        private fb: FormBuilder,
        private chatService: ChatService,
        private util: Util,
    ) {}

    ngOnInit() {
        this.order = this.navParams.get('order');
        this.isClient = this.navParams.get('isClient');;
        this.chatForm = this.fb.group({
			text: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
        });
        this.chatService.onMessage.subscribe((data: {}) => {
            if (data["orderId"] == this.order.id){
                this.messages = data["messages"]
                this.chatView.nativeElement.scrollTop = this.chatView.nativeElement.scrollHeight;
            }
        })
        this.chatService.fetchMessages(this.order.id)
    }

    sendChat() {
        this.chatService.sendMessage(this.order.id, this.chatForm.value.text)
        this.chatForm.get('text').setValue("")
    }
}