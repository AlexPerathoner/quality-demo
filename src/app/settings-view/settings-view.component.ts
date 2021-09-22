import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PoiType, TravelType } from '@targomo/core';
import { MapService } from 'services/map.service';
import { QualityService } from 'services/quality.service';
@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent {
    @Input() isVisible = false
    @Output() closeClicked = new EventEmitter()
  
    temporaryTravelMode: TravelType
    temporaryMaxTravel: number
    selectedPoiTypes: PoiType[]

    constructor(private map: MapService, public qualityService: QualityService) {
      this.temporaryMaxTravel = qualityService.maxTravel
      this.temporaryTravelMode = qualityService.travelMode
      this.selectedPoiTypes = [...qualityService.selectedPoiTypes]
    }

    onClose() {
      this.closeClicked.emit("")
    }

    changeTravelMode(mode: TravelType) {
      this.temporaryTravelMode = mode
    }

    onMaxTravelChanged(event) {
      this.temporaryMaxTravel = event.value
      this.map.updateMap()
    }

    updateSelectedPoiTypes(selectedPoiTypes: PoiType[]) {
      this.selectedPoiTypes = selectedPoiTypes
    }

    onSave() {
      this.qualityService.travelMode = this.temporaryTravelMode
      this.qualityService.maxTravel = this.temporaryMaxTravel
      this.qualityService.selectedPoiTypes = [...this.selectedPoiTypes]      
      this.map.updateMap()
      this.onClose()
    }
}
