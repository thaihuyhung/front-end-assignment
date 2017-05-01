import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {CommonService} from "./services/common.service";
import {WebSocketService} from "./core/web-socket.service";
import { MdCardModule, MdListModule, MdIconModule, MdProgressBarModule } from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MdCardModule,
    MdListModule,
    MdIconModule,
    MdProgressBarModule,
  ],
  providers: [CommonService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
