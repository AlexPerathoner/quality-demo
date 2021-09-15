import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng, LatLngId } from '@targomo/core'
import { Subject } from 'rxjs'
import { NamedMarker } from 'app/types/types'
import { DynamicComponentService } from './dynamic-component.service'
import { PopupComponent } from 'app/popup/popup.component'
import { PopupModel } from 'app/popup/popup.model'
import { LocationNamesService } from './location-names.service'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  sourceMarkers: NamedMarker[] = []

  private temporaryMarker: NamedMarker = null
  
  private contextPopup: mapboxgl.Popup = null

  private markersUpdated = new Subject<LatLngId[]>()
  private markerSelected = new Subject<String>()
  
  constructor(private dynamicComponentService: DynamicComponentService, private reverseGeocoding: LocationNamesService, @Optional() @SkipSelf() sharedService?: MapService) {
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

    const startLocations = [{lng: -0.0754, lat: 51.51626}, {lng: -0.05, lat: 51.51}]
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
      center: [-0.0754,51.51626]
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    const attributionText = `<a href='//localhost:1313/resources/attribution/' target='_blank'>&copy; Targomo</a>`;
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: attributionText }))
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
      }));
    
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
    const el = this.createTemporaryMarker()
    this.temporaryMarker = new NamedMarker(el, {
      draggable: false
    })
    this.temporaryMarker.name = name
    this.temporaryMarker.setLngLat(latLng).addTo(this.map)
  }

  private hideTemporaryMarker() {
    if(this.temporaryMarker) {
      this.temporaryMarker.remove()
    }
  }
  
  addMarker(markerId: string, latLng: LatLng) {
    const el = this.createMarker()
    const marker = new NamedMarker(el, {
      draggable: true
    })
    marker.setLngLat(latLng).addTo(this.map)
    marker.name = markerId
    marker.on('dragend', () => {
      this.selectMarker(markerId)
      this.markerSelected.next(markerId)
    })
    marker.getElement().addEventListener('click', () => {
      this.markerToSelect = markerId
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

  private markerToSelect = null

  selectMarker(markerId: string) {
    const markerFeature: NamedMarker = this.getMarker(markerId)
    this.unselectMarker()
    markerFeature.getElement().id = "selected-marker" // Setting id to current marker
    this.hideContextMenu()
    this.updateMap()
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
    this.map.flyTo({
      center: feature.getLngLat(),
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