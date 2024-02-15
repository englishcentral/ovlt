import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VocabularyAppModule } from "src/app/vocabulary-app/vocabulary-app.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        VocabularyAppModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
