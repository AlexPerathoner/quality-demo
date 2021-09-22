import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatSliderChange } from '@angular/material/slider'
import { PoiType, TravelType } from '@targomo/core'
import { MapService } from 'services/map.service'
import { QualityService } from 'services/quality.service'

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css'],
})
export class SettingsViewComponent {
  @Input() isVisible = false
  @Output() closeClicked = new EventEmitter()

  temporaryTravelMode: TravelType
  temporaryMaxTravel: number
  selectedPoiTypes: PoiType[]

  constructor(private mapService: MapService, public qualityService: QualityService) {
    this.temporaryMaxTravel = qualityService.maxTravel
    this.temporaryTravelMode = qualityService.travelMode
    this.selectedPoiTypes = [...qualityService.selectedPoiTypes]
  }

  onClose(): void {
    this.closeClicked.emit('')
  }

  changeTravelMode(mode: TravelType): void {
    this.temporaryTravelMode = mode
  }

  onMaxTravelChanged(event: MatSliderChange): void {
    this.temporaryMaxTravel = event.value
    this.mapService.updateMap()
  }

  updateSelectedPoiTypes(selectedPoiTypes: PoiType[]): void {
    this.selectedPoiTypes = selectedPoiTypes
  }

  onSave(): void {
    this.qualityService.travelMode = this.temporaryTravelMode
    this.qualityService.maxTravel = this.temporaryMaxTravel
    this.qualityService.selectedPoiTypes = [...this.selectedPoiTypes]
    this.mapService.updateMap()
    this.onClose()
  }
  
}
