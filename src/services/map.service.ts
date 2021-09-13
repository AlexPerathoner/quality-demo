import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng, LatLngId } from '@targomo/core'
import { LocationWidgetComponent } from 'app/location-widget/location-widget.component'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  lng = -0.0754
  lat = 51.51626
  zoom = 12
  sourceMarkers: mapboxgl.Marker[] = []
  locationsWidget: LocationWidgetComponent
  
  constructor(@Optional() @SkipSelf() sharedService?: MapService) {
    if(sharedService) {
      throw new Error("Map Service already loaded!")
    }
    console.info("Map Service created")
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    const attributionText = `<a href='//localhost:1313/resources/attribution/' target='_blank'>&copy; Targomo</a>`;
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: attributionText }))
    const startLocations = [{lng: -0.0754, lat: 51.51626}, {lng: -0.05, lat: 51.51}]
    startLocations.forEach((elem) => {
      this.addMarker(elem)
    })
  }

  addMarker(latLng: LatLng) {
    const marker = new mapboxgl.Marker({
      draggable: true
    })
    marker.setLngLat(latLng).addTo(this.map)
    const markerId = this.sourceMarkers.length+""
    marker.on('dragend', () => {
      this.locationsWidget.selectedLocation = markerId
      this.updateMap()
    })

    marker.getElement().addEventListener('click', () => {
      const id = (parseInt(markerId)+1)+""
      this.locationsWidget.selectMarker(id)
    });
    this.sourceMarkers.push(marker)
    this.updateMap()
  }

  updateMap() {
    //this.mapLoading.show()
    this.locationsWidget.updateLocationsScores()
    
    //this.mapLoading.hide()
  }

  flyToMarker(markerIndex: number) {
    const currentFeature = this.sourceMarkers[markerIndex]
    this.map.flyTo({
      center: currentFeature.getLngLat(),
      zoom: 14
    });
  }

  getMarkersLocations(): LatLngId[] {
    let locations: LatLngId[] = []
    this.sourceMarkers.forEach((marker, index) => {
        locations[index] = { ... marker.getLngLat(), id: index+1 }
    })
    return locations
  }
}
