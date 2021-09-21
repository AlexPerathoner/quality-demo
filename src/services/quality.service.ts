import { Injectable } from '@angular/core'
import { EdgeWeightType, LatLngId, OSMType, PoiHierarchy, PoiType, QualityRequestOptions, TravelMode, TravelType } from '@targomo/core'
import { client } from './global'


@Injectable({providedIn: 'root'})

export class QualityService {
   coreServiceUrl = 'https://api.targomo.com/britishisles/'
   // Travel options
   edgeWeight: EdgeWeightType = 'time' // Can be 'time' or 'distance'
   maxTravel = 1800 // Integer that represents meters or seconds, depending on EDGE_WEIGHT's value
   travelMode: TravelType = 'walk' // Can be 'walk', 'car', 'bike' or 'transit'
   separateScores = true

   // Will be retrieved from the settings panel, which gets them using the poi hierarchy 
   selectedPOITypes: PoiType[] = [
      {"id":"g_eat-out","name":"Gastronomy","description":"Restaurants and other places for eating out","type":"CATEGORY","contents":
         [{"id":"fast_food","name":"Fast food","description":"Place concentrating on very fast counter-only service and take-away food","key":"amenity","value":"fast_food","type":"TAG"},
         {"id":"food_court","name":"Food court","description":"Place with sit-down facilities shared by multiple self-service food vendors","key":"amenity","value":"food_court","type":"TAG"},
         {"id":"restaurant","name":"Restaurant","description":"Place selling full sit-down meals with servers","key":"amenity","value":"restaurant","type":"TAG"}]},
      {"id": "cafe","name": "Cafe","description": "Place with sit-down facilities selling beverages and light meals and/or snacks","key": "amenity","value": "cafe","type": "TAG"}
      ]
   poiHierarchy: PoiHierarchy

   fakePoi: PoiHierarchy = [
      {"id":"g_eat-out","name":"Gastronomy","description":"Restaurants and other places for eating out","type":"CATEGORY","contents":
         [{"id":"fast_food","name":"Fast food","description":"Place concentrating on very fast counter-only service and take-away food","key":"amenity","value":"fast_food","type":"TAG"},
         {"id":"food_court","name":"Food court","description":"Place with sit-down facilities shared by multiple self-service food vendors","key":"amenity","value":"food_court","type":"TAG"},
         {"id":"restaurant","name":"Restaurant","description":"Place selling full sit-down meals with servers","key":"amenity","value":"restaurant","type":"TAG"}]},
      {"id":"g_eat-out2","name":"Gastronomy","description":"Restaurants and other places for eating out","type":"CATEGORY","contents":
         [{"id":"fast_food","name":"Fast food","description":"Place concentrating on very fast counter-only service and take-away food","key":"amenity","value":"fast_food","type":"TAG"},
         {"id":"food_court","name":"Food court","description":"Place with sit-down facilities shared by multiple self-service food vendors","key":"amenity","value":"food_court","type":"TAG"},
         {"id":"restaurant","name":"Restaurant","description":"Place selling full sit-down meals with servers","key":"amenity","value":"restaurant","type":"TAG"}]}
      ]

   poiTypesToOSMTypes(POITypes: PoiType[]): OSMType[] {
      let osmTypes: OSMType[] = []
      POITypes.forEach(POIType => {
         if(POIType.contents) {
            //osmTypes.push(...this.poiTypesToOSMTypes(POIType.contents))
            osmTypes.push({key: "group", value: POIType.id})
         } else {
            osmTypes.push({key: POIType.key, value: POIType.value})
         }
      })
      return osmTypes
   }

   getOsmTypes(): OSMType[] {
      return this.poiTypesToOSMTypes(this.selectedPOITypes)
   }


   private createRequestOptions(): QualityRequestOptions {
      let requestOptions: QualityRequestOptions = {}
         this.poiTypesToOSMTypes(this.selectedPOITypes).forEach(osmType => {
            requestOptions[osmType.value] = {
               type: 'poiCoverageCount',
               osmTypes: [osmType],
               maxEdgeWeight: this.maxTravel,
               edgeWeight: this.edgeWeight,
               travelMode: {[this.travelMode]: {}
            } as TravelMode,
            coreServiceUrl: this.coreServiceUrl
         }
      })

      return requestOptions
   }

   async getScores(locations: LatLngId[]) {
      let requestOptions: QualityRequestOptions = this.createRequestOptions()
      const results = await client.quality.fetch(locations, requestOptions)    
      return results.data
   }


   constructor() {
      client.pois.hierarchy().then(response => {
         this.poiHierarchy = response
      })
      
   }

}