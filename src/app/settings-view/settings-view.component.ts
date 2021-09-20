import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TravelType } from '@targomo/core';
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
  
    onClose() {
      this.closeClicked.emit("")
    }

    constructor(private map: MapService, public qualityService: QualityService) { }

    changeTravelMode(mode: TravelType) {
        this.qualityService.travelMode = mode
        this.map.updateMap()
    }

    onMaxTravelChanged(event) {
        this.qualityService.maxTravel = event.value
        this.map.updateMap()
    }

}
