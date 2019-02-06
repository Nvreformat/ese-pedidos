import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

export class Restaurant {
    id: number
    menu: MenuCategory[]
}

export class MenuCategory {
    open: boolean = false
    products: Product[]
}

export class Product {
    count: number = 1
    name: string
    id: number
    info: string
    price: number
}

export class Order {
    id: number
    restaurantId: number
    address: string
    price: number
    status: string
    location: any[]
    comments: string
    date: string
    products: Product[]
}