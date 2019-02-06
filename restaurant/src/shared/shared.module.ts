import { NgModule } from '@angular/core';
import { FancyInput } from './fancy-input/fancy-input';
import { IonicModule } from 'ionic-angular';
import { PopupWindow } from './popup/popup-window';
import { OrderProducts } from './order-products/order-products';
import { FancySpinner } from './fancy-spinner/fancy-spinner';
import { Util } from './misc/utils';
import { OrderChatPage } from './chat/order-chat';
import { SocketIoModule } from 'ngx-socket-io';
import { ChatService } from './chat/chat-service';
import { EnvironmentService } from './environment.service';

@NgModule({
	declarations: [
		FancyInput,
		PopupWindow,
		OrderProducts,
		FancySpinner,
		OrderChatPage
	],
	imports: [
		IonicModule,
		SocketIoModule.forRoot({ url: EnvironmentService.getServerURL(), options: {} })
	],
	providers: [
		Util,
		ChatService,
		EnvironmentService],
	entryComponents: [
		OrderChatPage
	],
	exports: [
		FancyInput,
		PopupWindow,
		OrderProducts,
		FancySpinner,
		OrderChatPage
	]
})
export class SharedModule {}
