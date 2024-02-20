import { Component } from '@angular/core';
import { Logger } from "./common/logger";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor() {
        Logger.setDebugMode(true);
    }
}
