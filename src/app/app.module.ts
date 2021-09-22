import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DynamicComponentService } from 'services/dynamic-component.service'
import { PoiTreeModule } from '../lib/poi-tree/poi-tree.module'
import { MaterialModule } from './material.module'

import { AppComponent } from './app.component'
import { MapComponent } from './map/map.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { WidgetComponent } from './widget/widget.component'
import { BtnComponent } from './btn/btn.component'
import { SettingsViewComponent } from './settings-view/settings-view.component'
import { LocationWidgetComponent } from './location-widget/location-widget.component'
import { PopupComponent } from './popup/popup.component'
import { SettingsBtnComponent } from './settings-btn/settings-btn.component'
import { ResetBtnComponent } from './reset-btn/reset-btn.component'
import { DetailsWidgetComponent } from './details-widget/details-widget.component'
import { ProgressCircleComponent } from './progress-circle/progress-circle.component'
import { OptionBtnComponent } from './option-btn/option-btn.component'
import { ModalComponent } from './modal/modal.component'


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
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PoiTreeModule,
    MaterialModule
  ],
  providers: [DynamicComponentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
