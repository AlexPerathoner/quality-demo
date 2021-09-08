import { Injectable } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng } from '@targomo/core'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  lat = 45.899977
  lng = 6.172652
  zoom = 12
  sourceLocations: mapboxgl.Marker[] = []
  
  constructor() {
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })
    this.map.addControl(new mapboxgl.NavigationControl())

    const startLocations = [[-0.0754, 51.51626],[-0.05, 51.51]]
    startLocations.forEach(elem => {
      this.sourceLocations.push(
        
      )
    })

  }

  addMarker(latLng: LatLng) {
    const marker = new mapboxgl.Marker({
      draggable: true
    })
    
  }
}