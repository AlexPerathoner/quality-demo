import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PoiType } from '@targomo/core';
import { MapService } from 'services/map.service';
import { QualityService } from 'services/quality.service';

@Component({
  selector: 'poi-accordion',
  templateUrl: './poi-accordion.component.html',
  styleUrls: ['./poi-accordion.component.css'],
})
export class PoiAccordionComponent {

  @Input() poiList: PoiType[]

  constructor(private map: MapService, private qualityService: QualityService) { }

  onClick(event, poiId) {
    this.handleSelectedPoiChanges(event.checked, poiId)
  }

  handleSelectedPoiChanges(add: boolean, id: string) {
    const poi = this.getChildById(this.poiList, id)
    
    if(add) {
      this.qualityService.addPoiType(poi)
    } else {
      this.qualityService.removePoiType(poi)
    }
    this.map.updateMap()
  }

  getChildById(arr: PoiType[], id: string): PoiType {
    let filtered = arr.filter(poi => {
      return poi.id == id
    })
    let result: PoiType
    if(filtered[0]) {
      result = filtered[0]
    } else {
      result = null
    }
    return result
  }
}
