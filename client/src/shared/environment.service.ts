import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
 
@Injectable()
export class EnvironmentService {
    private token: string;
    private static readonly ip: string = "127.0.0.1"
    private static readonly port: number = 1337

    constructor(
        private toast: ToastController
    ) {}

    getApiURL(partialURL: string) : string {
        return EnvironmentService.getServerURL() + partialURL
    }
    
    toPlainHttpParams(args: {}) {
        return { headers: new HttpHeaders(args) }
    }

    toAuthHttpParams(args: {} = {}) {
        args["token"] = this.getToken()

        return { headers: new HttpHeaders(args) }
    }

    getDefaultErrorMessage(error: HttpErrorResponse) : string {
        if (error.error instanceof Error)
			return "Unknown error: " + error.message
        else 
			return "Unknown server error (Code " + error.status + ")"
    }

    setToken(token: string) {
        this.token = token
    }

    getToken() {
        return this.token
    }

    static getServerURL() : string {
        return "http://" + EnvironmentService.ip + ":" + EnvironmentService.port
    }

    makeToast(message: string, duration: number = 2000) {
        let toastParams = {
            message: message,
            duration: 2000
        };

        this.toast.create(toastParams).present();
    }

    makeToastFromError(error: HttpErrorResponse, duration: number = 2000) {
        this.makeToast(this.getDefaultErrorMessage(error), duration)
    }
}