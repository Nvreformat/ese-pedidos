import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FancyInput),
    multi: true
};
@Component({
    selector: 'fancy-input',
    templateUrl: 'fancy-input.html',
    providers: [VALUE_ACCESSOR]
})
export class FancyInput implements ControlValueAccessor {
    private innerValue: string = "";
    private changed = new Array<(value: string) => void>();
    private touched = new Array<() => void>();
    private _title: string = ""
    private _type: string = "text"
    private _maxlength: string = "99999"

    @Input()
    set title(title: string) {
        this._title = title
    }

    @Input()
    set type(type: string) {
        this._type = type
    }

    @Input()
    set maxlength(length: string) {
        this._maxlength = length
    }

    get value(): string {
        return this.innerValue;
    }

    set value(value: string) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.changed.forEach(f => f(value));
        }
    }

    touch() {
        this.touched.forEach(f => f());
    }

    writeValue(value: string) {
        this.innerValue = value;
    }

    registerOnChange(fn: (value: string) => void) {
        this.changed.push(fn);
    }

    registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }
}