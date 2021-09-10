import { Injectable } from '@angular/core'
import { LatLngId, TravelMode } from '@targomo/core'
import { client, EDGE_WEIGHT, MAX_TRAVEL, TRAVEL_MODE } from './global'


@Injectable({providedIn: 'root'})

export class QualityRequest {

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
        maxEdgeWeight: MAX_TRAVEL,
        edgeWeight: EDGE_WEIGHT,
        travelMode: {[TRAVEL_MODE]: {}} as TravelMode,
        coreServiceUrl: 'https://api.targomo.com/britishisles/'
      }
    })
    
    return results.data
  }

}