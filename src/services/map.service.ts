import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng } from '@targomo/core'
import { Subject } from 'rxjs'
import { NamedLatLngId, NamedMarker } from 'app/types/types'
import { DynamicComponentService } from './dynamic-component.service'
import { PopupComponent } from 'app/popup/popup.component'
import { PopupModel } from 'app/popup/popup.model'
import { LocationNamesService } from './location-names.service'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  sourceMarkers: NamedMarker[] = []

  private temporaryMarker: mapboxgl.Marker = null
  
  private contextPopup: mapboxgl.Popup = null

  private markersUpdated = new Subject<NamedLatLngId[]>()
  private markerSelected = new Subject<NamedMarker>()
  
  constructor(private dynamicComponentService: DynamicComponentService, private reverseGeocoding: LocationNamesService, @Optional() @SkipSelf() sharedService?: MapService) {
    if(sharedService) {
      throw new Error("Map Service already loaded!")
    }
    console.info("Map Service created")
  }

  getMarkerUpdateListener() {
    return this.markersUpdated.asObservable();
  }
  getMarkerSelectionListener() {
    return this.markerSelected.asObservable();
  }

  reset() {
    // Reset position
    this.map.setCenter([-0.0754,51.51626])
    // Reset zoom
    this.map.setZoom(12)

    this.resetMarkers()
  }

  resetMarkers() {
    for(let i=0; i<this.sourceMarkers.length; i++) {
      this.sourceMarkers[i].remove()
      this.sourceMarkers[i] = null
    }
    this.sourceMarkers = []

    const startLocations = [
      {lng: -0.075, lat: 51.51},
      {lng: -0.05, lat: 51.51},
      {lng: -0.025, lat: 51.51},
      {lng: 0, lat: 51.51},
      {lng: 0.025, lat: 51.51}
    ]
    startLocations.forEach(async (lngLat) => {
      let title1 = (await this.reverseGeocoding.getNameOfLocation({lat: lngLat.lat, lng: lngLat.lng}))[0]
      this.addMarker(title1, lngLat)
    })
  }
  
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-0.025,51.51626]
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
    const attributionText = `<a href='//localhost:1313/resources/attribution/' target='_blank'>&copy; Targomo</a>`;
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: attributionText }),"bottom-left")
    this.resetMarkers()
    this.map.on('click', (e) => {     
      // Clicking on the map while a marker is selected will unselect the marker
      // Clicking on the map while the context popup is shown will hide the popup
      // Clicking on the map while no marker is selected or popup is shown will show the popup 
      // Clicking on a marker will select the marker 
      if(this.markerToSelect) {
        this.selectMarker(this.markerToSelect)
        this.markerToSelect = null
      } else {
        if(this.isMarkerSelected()) {
          this.markerSelected.next(null)
          this.unselectMarker()
        } else {
          if(this.contextPopup) {
            this.hideContextMenu()
          } else {
            this.showContextPopup(e.lngLat)
          }
        }
      }    
    })
  }

  private hideContextMenu() {
    this.hideTemporaryMarker()
    if(this.contextPopup) {
      this.contextPopup.remove()
      this.contextPopup = null
    }
  }

  private async showContextPopup(lngLat: mapboxgl.LngLat) {
    this.showTemporaryMarker("", lngLat)
    let [title1, title2] = await this.reverseGeocoding.getNameOfLocation(lngLat)
    let popupContent = this.dynamicComponentService.injectComponent(
      PopupComponent,
      x => x.model = new PopupModel(title1, title2, "Add marker", () => {
        this.hideContextMenu()
        this.addMarker(title1, lngLat)
      }, this.sourceMarkers.length < 30, "Too many locations: 30 allowed."));
    
    const offset: mapboxgl.PointLike = [175, 75]
    this.contextPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: true, offset: offset })
      .setLngLat(lngLat) 
      .setDOMContent(popupContent)
      .addTo(this.map);
  }

  private createMarker() {
    const el = document.createElement('div');
    el.className = 'marker-dot';
    return el
  }
 
  private createTemporaryMarker() {
    const el = document.createElement('div');
    el.className = 'temporary-marker-dot';
    return el
  }
  private showTemporaryMarker(name: string, latLng: LatLng) {
    this.hideTemporaryMarker()
    const el = this.createTemporaryMarker()
    this.temporaryMarker = new mapboxgl.Marker(el, {
      draggable: false
    })
    this.temporaryMarker.setLngLat(latLng).addTo(this.map)
  }
  private hideTemporaryMarker() {
    if(this.temporaryMarker) {
      this.temporaryMarker.remove()
    }
  }
  
  addMarker(markerName: string, latLng: LatLng) {
    const markerId = this.sourceMarkers.length + 1
    const el = this.createMarker()
    const marker = new NamedMarker(el, {
      draggable: true
    })
    marker.setLngLat(latLng).addTo(this.map)
    marker.name = markerName
    marker.id = markerId
    marker.on('dragend', async () => {
      this.selectMarker(markerId)
      marker.name = (await this.reverseGeocoding.getNameOfLocation(marker.getLngLat()))[0]
      this.updateMap()
    })
    marker.getElement().addEventListener('click', () => {
      this.markerToSelect = markerId
    })

    this.sourceMarkers.push(marker)
    this.updateMap()
  }

  updateMap() {
    //this.mapLoading.show()
    this.markersUpdated.next(this.getMarkersLocations())
    //this.mapLoading.hide()
  }

  getMarker(id: number): NamedMarker | null {
    for(let i=0; i<this.sourceMarkers.length; i++) {
      if(id == this.sourceMarkers[i].id) {
        return this.sourceMarkers[i]
      }
    }
    return null
  }

  private markerToSelect: number = null

  selectMarker(markerId: number) {
    const markerFeature: NamedMarker = this.getMarker(markerId)
    this.markerSelected.next(markerFeature)
    this.unselectMarker()
    markerFeature.getElement().id = "selected-marker" // Setting id to current marker
    this.hideContextMenu()
    this.flyTo(markerFeature)
  }

  isMarkerSelected() {
    return (document.getElementById('selected-marker'))
  }

  unselectMarker() {
    const oldSelectedMarker = this.isMarkerSelected() // Removing id from previous marker
    if(oldSelectedMarker) {oldSelectedMarker.id = ""}
  }

  flyTo(feature: mapboxgl.Marker) {
    let selectionZoom = 14
    if(this.map.getZoom() > selectionZoom) {
      selectionZoom = this.map.getZoom()
    }
    this.map.flyTo({
      center: feature.getLngLat(),
      zoom: selectionZoom
    });
    
  }

  getMarkersLocations(): NamedLatLngId[] {
    let locations: NamedLatLngId[] = []
    this.sourceMarkers.forEach((marker, index) => {
        locations[index] = { ... marker.getLngLat(), id: marker.id, name: marker.name}
    })
    return locations
  }
}