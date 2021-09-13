import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WidgetComponent } from './widget/widget.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsBtnComponent } from './settings-btn/settings-btn.component';
import { MatIconModule } from '@angular/material/icon';
import { SettingsViewComponent } from './settings-view/settings-view.component';
import { LocationWidgetComponent } from './location-widget/location-widget.component';
import { LoadingLabelComponent } from './loading-label/loading-label.component';
import { PopupService } from 'services/popup.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    WidgetComponent,
    SettingsBtnComponent,
    SettingsViewComponent,
    LocationWidgetComponent,
    LoadingLabelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [PopupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
