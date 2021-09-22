import { Injectable } from '@angular/core'
import { LatLngId, QualityRequestOptions, TravelMode } from '@targomo/core'
import { ClientOptionService } from './client-option.service'
import { client } from './global'


@Injectable({providedIn: 'root'})

export class QualityService {

  private createRequestOptions(): QualityRequestOptions {
    const requestOptions: QualityRequestOptions = {}
    this.clientOption.getOsmTypes().forEach(osmType => {
      requestOptions[osmType.key + '-' + osmType.value] = {
        type: 'poiCoverageCount',
        osmTypes: [osmType],
        maxEdgeWeight: this.clientOption.maxTravel,
        edgeWeight: this.clientOption.edgeWeight,
        travelMode: {[this.clientOption.travelMode]: {}} as TravelMode,
        coreServiceUrl: this.clientOption.coreServiceUrl
      }
    })

    return requestOptions
  }

  async getScores(locations: LatLngId[]) {
    const requestOptions: QualityRequestOptions = this.createRequestOptions()
    const results = await client.quality.fetch(locations, requestOptions)    
    return results.data
  }

  constructor(private clientOption: ClientOptionService) {  }

}