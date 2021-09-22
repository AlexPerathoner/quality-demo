import { Injectable } from '@angular/core'
import { LatLngId } from '@targomo/core'
import { ClientOptionService } from './client-option.service'
import { client } from './global'

@Injectable({
  providedIn: 'root'
})
export class PoiService {

  constructor(private clientOption: ClientOptionService) { }

  // register the initial reachability context request
  uuid = ''
  async registerInitialRequest(locations: LatLngId[]): Promise<void> {
    this.uuid = await this.registerNewRequest(locations)
  }

  async registerNewRequest(location: LatLngId[]): Promise<string>
  async registerNewRequest(location: LatLngId): Promise<string>
  async registerNewRequest(location: LatLngId | LatLngId[]): Promise<string> {
    const osmTypes = this.clientOption.getOsmTypes()
    const options = {
      maxEdgeWeight: this.clientOption.maxTravel,
      travelType: this.clientOption.travelMode,
      edgeWeight: this.clientOption.edgeWeight,
      osmTypes: osmTypes
    }
    // register a new reachability context and return its uuid
    let sources: LatLngId[]
    if(location instanceof Array) {
      sources = location
    } else {
      sources = [location]
    }
    const uuid = await client.pois.reachabilityRegister(sources, options)
    return uuid
  }

  getPoiUrl(): string[]
  getPoiUrl(uuid: string): string[]
  getPoiUrl(uuid?: string): string[] {
    if(!uuid) {uuid = this.uuid}
    return [`https://api.targomo.com/pointofinterest/reachability/${uuid}/{z}/{x}/{y}.mvt?apiKey=${client.serviceKey}` +
              '&loadAllTags=true&layerType=node']
  }

}
