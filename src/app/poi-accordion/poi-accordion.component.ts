import { Component, Input } from '@angular/core';
import { PoiType } from '@targomo/core';
import { PoiTypesService } from 'services/poi-types.service';

@Component({
  selector: 'poi-accordion',
  templateUrl: './poi-accordion.component.html',
  styleUrls: ['./poi-accordion.component.css'],
})
export class PoiAccordionComponent {

  @Input() poiList: PoiType[]

  constructor(private poiTypesService: PoiTypesService) { }

  onClick(event, poiId) {
    this.handleSelectedPoiChanges(event.checked, poiId)
  }

  handleSelectedPoiChanges(add: boolean, id: string) {
    const poi = this.getChildById(this.poiList, id)
    
    if(add) {
      this.poiTypesService.addPoiType(poi)
    } else {
      this.poiTypesService.removePoiType(poi)
    }
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
