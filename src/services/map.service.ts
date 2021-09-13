import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng, LatLngId } from '@targomo/core'
import { Subject } from 'rxjs'
import { NamedMarker } from 'app/types/types'
import { PopupService } from './popup.service'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  lng = -0.0754
  lat = 51.51626
  zoom = 12
  sourceMarkers: NamedMarker[] = []

  private markersUpdated = new Subject<LatLngId[]>()
  private markerSelected = new Subject<String>()
  
  constructor(@Optional() @SkipSelf() sharedService?: MapService) {
    if(sharedService) {
      throw new Error("Map Service already loaded!")
    }
    console.info("Map Service created")
  }

  getMarkerUpdateListener() {
    return this.markersUpdated.asObservable();
  }
  getMarkerSelectListener() {
    return this.markerSelected.asObservable();
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
    this.map.on('click', (e) => {
      const locClickedPopup = new PopupService("", "", "Add Marker")
        this.closeContextMenu()
        new mapboxgl.Popup({offset: [20, 0]})
            .setLngLat(e.lngLat)
            .setDOMContent(locClickedPopup.makePopup())
            .addTo(this.map);
      document.getElementById('add-marker-btn').addEventListener('click', () => { this.addMarker(e.lngLat) })
    })
  }

  private closeContextMenu() {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
  }
 


  
  addMarker(latLng: LatLng) {
    const marker = new NamedMarker({
      draggable: true
    })
    marker.setLngLat(latLng).addTo(this.map)
    const markerId = this.sourceMarkers.length+1+""
    marker.name = markerId
    marker.on('dragend', () => {
      this.markerSelected.next(markerId)
      this.updateMap()
    })
    marker.on('click', () => { // TODO CHECK IF WORKS
      this.markerSelected.next(markerId)
    })

    this.sourceMarkers.push(marker)
    this.updateMap()
  }

  updateMap() {
    //this.mapLoading.show()
    this.markersUpdated.next(this.getMarkersLocations())
    //this.mapLoading.hide()
  }

  getMarker(id: string): NamedMarker | null {
    for(let i=0; i<this.sourceMarkers.length; i++) {
      if(id == this.sourceMarkers[i].name) {
        return this.sourceMarkers[i]
      }
    }
    return null
  }

  flyToMarker(markerId: string) {
    const currentFeature = this.getMarker(markerId)
    this.map.flyTo({
      center: currentFeature.getLngLat(),
      zoom: 14
    });
  }

  getMarkersLocations(): LatLngId[] {
    let locations: LatLngId[] = []
    this.sourceMarkers.forEach((marker, index) => {
        locations[index] = { ... marker.getLngLat(), id: marker.name}
    })
    return locations
  }
}