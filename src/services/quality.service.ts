import { Injectable } from '@angular/core'
import { EdgeWeightType, LatLng, LatLngId, OSMType, PoiHierarchy, PoiType, QualityRequestOptions, TravelMode, TravelType } from '@targomo/core'
import { Subject } from 'rxjs'
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
  selectedPoiTypes: PoiType[] = [
    {"id":"g_eat-out","name":"Gastronomy","description":"Restaurants and other places for eating out","type":"CATEGORY","contents":
      [{"id":"fast_food","name":"Fast food","description":"Place concentrating on very fast counter-only service and take-away food","key":"amenity","value":"fast_food","type":"TAG"},
      {"id":"food_court","name":"Food court","description":"Place with sit-down facilities shared by multiple self-service food vendors","key":"amenity","value":"food_court","type":"TAG"},
      {"id":"restaurant","name":"Restaurant","description":"Place selling full sit-down meals with servers","key":"amenity","value":"restaurant","type":"TAG"}]},
    {"id": "cafe","name": "Cafe","description": "Place with sit-down facilities selling beverages and light meals and/or snacks","key": "amenity","value": "cafe","type": "TAG"}
  ]
  poiHierarchy: PoiHierarchy
  hierarchyUpdated = new Subject<PoiType[]>()

  private poiTypesToOsmTypes(PoiTypes: PoiType[]): OSMType[] {
    let osmTypes: OSMType[] = []
    PoiTypes.forEach(PoiType => {
      if(PoiType.contents) {
        //osmTypes.push(...this.poiTypesToOSMTypes(PoiType.contents))
        osmTypes.push({key: "group", value: PoiType.id})
      } else {
        osmTypes.push({key: PoiType.key, value: PoiType.value})
      }
    })
    return osmTypes
  }

  getOsmTypes(): OSMType[] {
    return this.poiTypesToOsmTypes(this.selectedPoiTypes)
  }

  getHierarchyUpdateListener() {
    return this.hierarchyUpdated.asObservable();
  }


  private createRequestOptions(): QualityRequestOptions {
    let requestOptions: QualityRequestOptions = {}
    this.getOsmTypes().forEach(osmType => {
      requestOptions[osmType.key + "-" + osmType.value] = {
        type: 'poiCoverageCount',
        osmTypes: [osmType],
        maxEdgeWeight: this.maxTravel,
        edgeWeight: this.edgeWeight,
        travelMode: {[this.travelMode]: {}} as TravelMode,
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
      this.hierarchyUpdated.next(this.poiHierarchy)
    })
  }

   // register the initial reachability context request
  uuid = ''
  async registerInitialRequest(locations: LatLngId[]){
    this.uuid = await this.registerNewRequest(locations);
  }

  async registerNewRequest(location: LatLngId[])
  async registerNewRequest(location: LatLngId)
  async registerNewRequest(location: LatLngId | LatLngId[]) {
    let osmTypes = this.getOsmTypes()
    const options = {
      maxEdgeWeight: this.maxTravel,
      travelType: this.travelMode,
      edgeWeight: this.edgeWeight,
      osmTypes: osmTypes
    }
    // register a new reachability context and return its uuid
    let sources: LatLngId[]
    if(location instanceof Array) {
      sources = location
    } else {
      sources = [location]
    }
    const uuid = await client.pois.reachabilityRegister(sources, options);
    return uuid;
  }

  getPoiUrl()
  getPoiUrl(uuid: string)
  getPoiUrl(uuid?: string) {
    if(!uuid) {uuid = this.uuid}
    return [`https://api.targomo.com/pointofinterest/reachability/${uuid}/{z}/{x}/{y}.mvt?apiKey=${client.serviceKey}` +
              `&loadAllTags=true&layerType=node`];
  }

}