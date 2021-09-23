import { Injectable, Optional, SkipSelf } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from '../environments/environment'
import { LatLng, LatLngId } from '@targomo/core'
import { Observable, Subject } from 'rxjs'
import { NamedLatLngId, NamedMarker } from 'app/types/types'
import { DynamicComponentService } from './dynamic-component.service'
import { PopupComponent } from 'app/popup/popup.component'
import { PopupModel } from 'app/popup/popup.model'
import { LocationNamesService } from './location-names.service'
import { PoiService } from './poi.service'
import { ClientOptionService } from './client-option.service'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  private layerId = 'poi'
  sourceMarkers: NamedMarker[] = []
  selectedMarker: NamedMarker = null

  private temporaryMarker: mapboxgl.Marker = null
  private markerToSelect: number = null
  
  private contextPopup: mapboxgl.Popup = null

  private markersUpdated = new Subject<NamedLatLngId[]>()
  private markerSelected = new Subject<NamedMarker>()
  
  constructor(
    private dynamicComponentService: DynamicComponentService,
    private reverseGeocoding: LocationNamesService,
    private poiService: PoiService,
    private clientOption: ClientOptionService,
    @Optional() @SkipSelf() sharedService?: MapService)
  {
    if(sharedService) {
      throw new Error('Map Service already loaded!')
    }
    console.info('Map Service created')
  }

  getMarkerUpdateListener(): Observable<NamedLatLngId[]> {
    return this.markersUpdated.asObservable()
  }
  getMarkerSelectionListener(): Observable<NamedMarker>  {
    return this.markerSelected.asObservable()
  }

  reset(): void {
    // Reset position
    this.map.setCenter([-0.025,51.51626])
    // Reset zoom
    this.map.setZoom(12)
    this.resetMarkers()
    this.clientOption.selectedPoiTypes = [
      {'id':'g_eat-out','name':'Gastronomy','description':'Restaurants and other places for eating out','type':'CATEGORY','contents':
         [{'id':'fast_food','name':'Fast food','description':'Place concentrating on very fast counter-only service and take-away food','key':'amenity','value':'fast_food','type':'TAG'},
           {'id':'food_court','name':'Food court','description':'Place with sit-down facilities shared by multiple self-service food vendors','key':'amenity','value':'food_court','type':'TAG'},
           {'id':'restaurant','name':'Restaurant','description':'Place selling full sit-down meals with servers','key':'amenity','value':'restaurant','type':'TAG'}]},
      {'id': 'cafe','name': 'Cafe','description': 'Place with sit-down facilities selling beverages and light meals and/or snacks','key': 'amenity','value': 'cafe','type': 'TAG'}
    ]
  }

  removeMarker(markerId: number): void {
    const markerToDelete = this.sourceMarkers.find(marker => marker.id == markerId)
    markerToDelete.remove()
    const index = this.sourceMarkers.indexOf(markerToDelete)    
    this.sourceMarkers.splice(index, 1)
    this.markersUpdated.next(this.getMarkersLocations())
    this.markerSelected.next()
  }

  async resetMarkers(): Promise<void> {
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
  
  buildMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-0.025,51.506]
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
    const attributionText = '<a href=\'//localhost:1313/resources/attribution/\' target=\'_blank\'>&copy; Targomo</a>'
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: attributionText }),'bottom-left')
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

  showPoiLayer(): void {
    this.map.setLayoutProperty(this.layerId, 'visibility', 'visible')
  }

  hidePoiLayer(): void {
    this.map.setLayoutProperty(this.layerId, 'visibility', 'none')
  }

  updatePoiLayerSource(): void {
    this.changePoiLayerSource({...this.selectedMarker.getLngLat(), id: this.selectedMarker.id})
  }

  async changePoiLayerSource(location: LatLngId): Promise<void> {
    const poiReachabilityUuid = await this.poiService.registerNewRequest(location)
    const mapSource: any = this.map.getSource('poi') // .tiles not accessible, storing as any
    mapSource.tiles = this.poiService.getPoiUrl(poiReachabilityUuid)

    const sourceCache = (this.map as any).style.sourceCaches['poi']
    // Force a refresh, so that the map will be repainted without you having to touch the map
    if(sourceCache != null) {
      (this.map as any).style.sourceCaches['poi'].clearTiles(); // .style not accessible, using as any
      (this.map as any).style.sourceCaches['poi'].update((this.map as any).transform)
    }
    this.map.triggerRepaint()
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
          '#666',
          'rgba(0,0,0,0)'
        ]
      }
    })
    // Change the cursor to a pointer when the mouse is over the poi layer
    this.map.on('mouseenter', 'poi', () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'poi', () => {
      this.map.getCanvas().style.cursor = ''
    })
  }

  private hideContextMenu(): void {
    this.hideTemporaryMarker()
    if(this.contextPopup) {
      this.contextPopup.remove()
      this.contextPopup = null
    }
  }

  private async showContextPopup(lngLat: mapboxgl.LngLat): Promise<void> {
    this.showTemporaryMarker('', lngLat)
    const [title1, title2] = await this.reverseGeocoding.getNameOfLocation(lngLat)
    const popupContent = this.dynamicComponentService.injectComponent(
      PopupComponent,
      x => x.model = new PopupModel(title1, title2, 'Add marker', () => {
        this.hideContextMenu()
        this.addMarker(title1, lngLat)
      }, this.sourceMarkers.length < 30, 'Too many locations: 30 allowed.'))
    
    const offset: mapboxgl.PointLike = [175, 75]
    this.contextPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: true, offset: offset })
      .setLngLat(lngLat) 
      .setDOMContent(popupContent)
      .addTo(this.map)
  }

  private createMarker(): HTMLDivElement {
    const el = document.createElement('div')
    el.className = 'marker-dot'
    return el
  }
 
  private createTemporaryMarker(): HTMLDivElement {
    const el = document.createElement('div')
    el.className = 'temporary-marker-dot'
    return el
  }

  private showTemporaryMarker(name: string, latLng: LatLng): void {
    this.hideTemporaryMarker()
    const el = this.createTemporaryMarker()
    this.temporaryMarker = new mapboxgl.Marker(el, {
      draggable: false
    })
    this.temporaryMarker.setLngLat(latLng).addTo(this.map)
  }

  private hideTemporaryMarker(): void {
    if(this.temporaryMarker) {
      this.temporaryMarker.remove()
    }
  }

  private markerCount = 0
  private silentlyAddMarker(markerName: string, latLng: LatLng): void {
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
  
  addMarker(markerName: string, latLng: LatLng): void {
    this.silentlyAddMarker(markerName, latLng)
    this.updateMap()
  }

  async updateMap(): Promise<void> {
    //this.mapLoading.show()
    const locations = this.getMarkersLocations()
    this.markersUpdated.next(locations)
    this.updatePoiLayerSource()
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

  selectMarker(markerId: number): void {
    this.unselectMarker() // Unselecting previously selected marker
    const markerFeature: NamedMarker = this.getMarker(markerId) // Getting marker to select 
    this.selectedMarker = markerFeature
    this.markerSelected.next(markerFeature) // Sending subject to other classes
    markerFeature.getElement().id = 'selected-marker' // Setting id to current marker to update style
    this.hideContextMenu()
    this.flyTo(markerFeature)

    this.showPoiLayer()
    this.updatePoiLayerSource()
  }

  isMarkerSelected(): boolean {
    return this.getSelectedMarker() != null
  }

  getSelectedMarker(): HTMLElement {
    return document.getElementById('selected-marker')
  }

  unselectMarker(): void {
    const oldSelectedMarker = this.getSelectedMarker() // Removing id from previous marker, updates style
    if(oldSelectedMarker) {oldSelectedMarker.id = ''}
    this.selectedMarker = null
    this.hidePoiLayer()
  }

  flyTo(feature: mapboxgl.Marker): void {
    let selectionZoom = 13
    if(this.map.getZoom() > selectionZoom) {
      selectionZoom = this.map.getZoom()
    }
    this.map.flyTo({
      center: feature.getLngLat(),
      zoom: selectionZoom
    })
    
  }

  getMarkersLocations(): NamedLatLngId[] {
    const locations: NamedLatLngId[] = []
    this.sourceMarkers.forEach((marker, index) => {
      locations[index] = { ... marker.getLngLat(), id: marker.id, name: marker.name}
    })
    return locations
  }
}