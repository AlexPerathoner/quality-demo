import { Injectable } from '@angular/core'
import { EdgeWeightType, LatLngId, TravelMode, TravelType } from '@targomo/core'
import { client } from './global'


@Injectable({providedIn: 'root'})

export class QualityRequest {
  // Travel options
  edgeWeight: EdgeWeightType = 'time' // Can be 'time' or 'distance'
  maxTravel = 1800 // Integer that represents meters or seconds, depending on EDGE_WEIGHT's value
  travelMode: TravelType = 'walk' // Can be 'walk', 'car', 'bike' or 'transit'

  setTravelMode(travelMode: TravelType) {
    this.travelMode = travelMode
  }

  async getScores(locations: LatLngId[]) {
    // Counting the reachable population for each location
    const results = await client.quality.fetch(locations, {
      'stats': {
        type: 'poiCoverageCount',
        osmTypes: [
            {
                'key': 'shop',
                'value': "supermarket"
            }
        ],
        maxEdgeWeight: this.maxTravel,
        edgeWeight: this.edgeWeight,
        travelMode: {[this.travelMode]: {}} as TravelMode,
        coreServiceUrl: 'https://api.targomo.com/britishisles/'
      }
    })
    
    return results.data
  }

}