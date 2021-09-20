import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WidgetComponent } from './widget/widget.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BtnComponent } from './btn/btn.component';
import { MatIconModule } from '@angular/material/icon';
import { SettingsViewComponent } from './settings-view/settings-view.component';
import { LocationWidgetComponent } from './location-widget/location-widget.component';
import { DynamicComponentService } from 'services/dynamic-component.service';
import { PopupComponent } from './popup/popup.component';
import { SettingsBtnComponent } from './settings-btn/settings-btn.component';
import { ResetBtnComponent } from './reset-btn/reset-btn.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DetailsWidgetComponent } from './details-widget/details-widget.component';
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import { OptionBtnComponent } from './option-btn/option-btn.component';
import { MatSliderModule } from '@angular/material/slider';
import { PoiSelectionDialogComponent } from './poi-selection-dialog/poi-selection-dialog.component';
import { ModalComponent } from './modal/modal.component'; 

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    WidgetComponent,
    BtnComponent,
    SettingsViewComponent,
    LocationWidgetComponent,
    PopupComponent,
    SettingsBtnComponent,
    ResetBtnComponent,
    DetailsWidgetComponent,
    ProgressCircleComponent,
    OptionBtnComponent,
    PoiSelectionDialogComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
  ],
  providers: [DynamicComponentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
