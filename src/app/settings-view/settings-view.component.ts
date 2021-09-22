import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatSliderChange } from '@angular/material/slider'
import { PoiType, TravelType } from '@targomo/core'
import { ClientOptionService } from 'services/client-option.service'
import { MapService } from 'services/map.service'

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

  constructor(private mapService: MapService, private clientOption: ClientOptionService) {
    this.temporaryMaxTravel = clientOption.maxTravel
    this.temporaryTravelMode = clientOption.travelMode
    this.selectedPoiTypes = [...clientOption.selectedPoiTypes]
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
    this.clientOption.travelMode = this.temporaryTravelMode
    this.clientOption.maxTravel = this.temporaryMaxTravel
    this.clientOption.selectedPoiTypes = [...this.selectedPoiTypes]
    this.mapService.updateMap()
    this.onClose()
  }
  
}
