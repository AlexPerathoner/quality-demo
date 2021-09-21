import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TravelType } from '@targomo/core';
import { MapService } from 'services/map.service';
import { PoiTypesService } from 'services/poi-types.service';
import { QualityService } from 'services/quality.service';
@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent {
    @Input() isVisible = false
    @Output() closeClicked = new EventEmitter()
  
    onClose() {
      this.closeClicked.emit("")
    }

    constructor(private map: MapService, public qualityService: QualityService, private poiTypesService: PoiTypesService) {
      this.temporaryMaxTravel = qualityService.maxTravel
      this.temporaryTravelMode = qualityService.travelMode
      this.poiTypesService.selectedPOITypes = [...qualityService.selectedPOITypes]
    }

    temporaryTravelMode: TravelType
    temporaryMaxTravel: number

    changeTravelMode(mode: TravelType) {
      this.temporaryTravelMode = mode
    }

    onMaxTravelChanged(event) {
      this.temporaryMaxTravel = event.value
      this.map.updateMap()
    }

    onSave() {
      this.qualityService.travelMode = this.temporaryTravelMode
      this.qualityService.maxTravel = this.temporaryMaxTravel
      this.qualityService.selectedPOITypes = [...this.poiTypesService.selectedPOITypes]
      
      this.map.updateMap()
      this.onClose()
    }
}
