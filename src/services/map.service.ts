import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng, LatLngId } from '@targomo/core'
import { Subject } from 'rxjs'
import { NamedLatLngId, NamedMarker } from 'app/types/types'
import { DynamicComponentService } from './dynamic-component.service'
import { PopupComponent } from 'app/popup/popup.component'
import { PopupModel } from 'app/popup/popup.model'
import { LocationNamesService } from './location-names.service'
import { QualityService } from './quality.service'
import { PoiService } from './poi.service'
import { ClientOptionService } from './client-option.service'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  private layerId = 'poi'
  sourceMarkers: NamedMarker[] = []

  private temporaryMarker: mapboxgl.Marker = null
  private markerToSelect: number = null
  
  private contextPopup: mapboxgl.Popup = null

  private markersUpdated = new Subject<NamedLatLngId[]>()
  private markerSelected = new Subject<NamedMarker>()
  
  constructor(
    private dynamicComponentService: DynamicComponentService,
    private reverseGeocoding: LocationNamesService,
    private qualityService: QualityService,
    private poiService: PoiService,
    private clientOption: ClientOptionService,
    @Optional() @SkipSelf() sharedService?: MapService)
  {
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
    this.map.setCenter([-0.025,51.51626])
    // Reset zoom
    this.map.setZoom(12)
    this.resetMarkers()
    this.clientOption.selectedPoiTypes = [
      {"id":"g_eat-out","name":"Gastronomy","description":"Restaurants and other places for eating out","type":"CATEGORY","contents":
         [{"id":"fast_food","name":"Fast food","description":"Place concentrating on very fast counter-only service and take-away food","key":"amenity","value":"fast_food","type":"TAG"},
         {"id":"food_court","name":"Food court","description":"Place with sit-down facilities shared by multiple self-service food vendors","key":"amenity","value":"food_court","type":"TAG"},
         {"id":"restaurant","name":"Restaurant","description":"Place selling full sit-down meals with servers","key":"amenity","value":"restaurant","type":"TAG"}]},
      {"id": "cafe","name": "Cafe","description": "Place with sit-down facilities selling beverages and light meals and/or snacks","key": "amenity","value": "cafe","type": "TAG"}
    ]
  }

  removeMarker(markerId: number) {
    const markerToDelete = this.sourceMarkers.find(marker => marker.id == markerId)
    markerToDelete.remove()
    const index = this.sourceMarkers.indexOf(markerToDelete)    
    this.sourceMarkers.splice(index, 1)
    this.markersUpdated.next(this.getMarkersLocations())
    this.markerSelected.next()
  }

  async resetMarkers() {
    this.markerCount = 0
    for(let i=0; i<this.sourceMarkers.length; i++) {
      this.sourceMarkers[i].remove()
      this.sourceMarkers[i] = null
    }
    this.sourceMarkers = []

    const startLocations: LatLngId[] = [
      {lng: -0.0652, lat: 51.5238, id: 1},
      {lng: -0.0753, lat: 51.5098, id: 2},
      {lng: -0.025, lat: 51.51, id: 3},
      {lng: 0.0481, lat: 51.5157, id: 4},
      {lng: -0.0103, lat: 51.4914, id: 5}
    ]
    this.poiService.registerInitialRequest(startLocations)
    const namedStartLocations: NamedLatLngId[] = await Promise.all(startLocations.map(async (loc) => {
      return {...loc, name: (await this.reverseGeocoding.getNameOfLocation({lat: loc.lat, lng: loc.lng}))[0]}
    }))
    namedStartLocations.forEach(loc => this.silentlyAddMarker(loc.name, {lat: loc.lat, lng: loc.lng}))
    this.markersUpdated.next(namedStartLocations)
  }
  
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-0.025,51.506]
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
    const attributionText = `<a href='//localhost:1313/resources/attribution/' target='_blank'>&copy; Targomo</a>`;
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: attributionText }),"bottom-left")
    this.resetMarkers()
    this.map.on('load', () => {

      this.addPoiLayer()
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
    })
  }

  showPoiLayer(location: LatLngId): void {
    
    this.map.setLayoutProperty(this.layerId, 'visibility', 'visible');
  }

  hidePoiLayer(): void {
    this.map.setLayoutProperty(this.layerId, 'visibility', 'none');
  }

  private addPoiLayer(): void {
    this.map.addLayer({
      'id': this.layerId,
      'type': 'circle',
      'source': {
          'type': 'vector',
          'tiles': this.poiService.getPoiUrl(),
          'minzoom': 9
      },
      'layout': {
        'visibility': 'none'
      },
      'source-layer': 'poi',
      'paint': {
          'circle-radius': ['+', 3, ['sqrt', ['get', 'numOfPois']]],
          'circle-color': [
              'case',
              ['!=', ['get', 'edgeWeight'], null],
              [
                  "interpolate-lab",
                  ['exponential', 1],
                  ['get', 'edgeWeight'],
                  0, 'hsl(120,70%,50%)',
                  this.clientOption.maxTravel/2, 'hsl(60,70%,50%)',
                  this.clientOption.maxTravel, 'hsl(0,70%,50%)'
              ],
              '#666'
          ]
      }
    });
    // Change the cursor to a pointer when the mouse is over the poi layer
    this.map.on("mouseenter", "poi", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    this.map.on("mouseleave", "poi", () => {
        this.map.getCanvas().style.cursor = "";
    });
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

  private markerCount = 0
  private silentlyAddMarker(markerName: string, latLng: LatLng) {
    const markerId = this.markerCount++ +1
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
  }
  
  addMarker(markerName: string, latLng: LatLng) {
    this.silentlyAddMarker(markerName, latLng)
    this.updateMap()
  }

  async updateMap() {
    //this.mapLoading.show()
    const poiReachabilityUuid = await this.poiService.registerNewRequest(this.getMarkersLocations());
    const mapSource: any = this.map.getSource('poi')
    
    mapSource.tiles = this.poiService.getPoiUrl(poiReachabilityUuid);
    this.markersUpdated.next(this.getMarkersLocations())

    const sourceCache = (this.map as any).style.sourceCaches['poi'];
    // Force a refresh, so that the map will be repainted without you having to touch the map
    if(sourceCache != null) {
      console.log("ASd");
      
      (this.map as any).style.sourceCaches['poi'].clearTiles();
      (this.map as any).style.sourceCaches['poi'].update((this.map as any).transform);
      
    }
    this.map.triggerRepaint();
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