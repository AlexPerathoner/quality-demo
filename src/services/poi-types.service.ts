import { Injectable } from '@angular/core';
import { PoiType } from '@targomo/core';

@Injectable({
  providedIn: 'root'
})
export class PoiTypesService {
  selectedPOITypes: PoiType[] = []
  constructor() { }

  addPoiType(poi: PoiType) {
    this.selectedPOITypes.push(poi)
  }

  removePoiType(poi: PoiType) {
    const index = this.selectedPOITypes.indexOf(poi)
    if(index > -1) {
      this.selectedPOITypes.splice(index, 1)
    }
  }
}
