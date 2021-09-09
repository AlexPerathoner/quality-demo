import { Injectable } from '@angular/core'
import * as mapboxgl from 'mapbox-gl'
import { environment } from "../environments/environment"
import { LatLng, LatLngId, LatLngIdScores, TravelMode } from '@targomo/core'
import { client, EDGE_WEIGHT, MAX_TRAVEL, TRAVEL_MODE } from './global'

@Injectable({providedIn: 'root'})

export class MapService {
  map!: mapboxgl.Map
  style = `https://api.maptiler.com/maps/positron/style.json?key=${environment.MapBox_API_KEY}`
  lat = 45.899977
  lng = 6.172652
  zoom = 12
  sourceMarkers: mapboxgl.Marker[] = []
  selectedLocation: number | null = null
  
  constructor() {
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

    const startLocations = [{lat: -0.0754, lng: 51.51626},{lat: -0.05, lng: 51.51}]
    startLocations.forEach((elem) => {
      this.addMarker(elem)
    })

  }

  addMarker(latLng: LatLng) {
    const marker = new mapboxgl.Marker({
      draggable: true
    })
    marker.setLngLat(latLng).addTo(this.map)
    const markerIndex = this.sourceMarkers.length
    marker.on('dragend', () => {
      this.selectedLocation = markerIndex
      this.updateMap()
    })

    marker.getElement().addEventListener('click', () => {
      this.selectMarker(markerIndex)
    });
    this.sourceMarkers.push(marker)
    this.updateLocationLabel()
  }

  selectMarker(markerIndex: number) {
    const features = document.getElementsByClassName('location')
    for(let i=0; features.length; i++) {
      const element: any = features[i] // Element type has dataset, as it was manually added. Adding any to silence error on next line, when accessing dataset in Element
      if(element.dataset.markerIndex == markerIndex) { // checking for dataset. When the table gets ordered by the result the index of the cell and its marker index don't match anymore
          element.classList.add("selected-location")
      } else {
          element.classList.remove("selected-location")
      }
    };
    this.selectedLocation = markerIndex
    this.flyToMarker(this.sourceMarkers[this.selectedLocation])
  }

  flyToMarker(currentFeature: mapboxgl.Marker) {
    this.map.flyTo({
      center: currentFeature.getLngLat(),
      zoom: 14
    });
  }

  updateMap() {
    /*pBar.show()
    updateLocationLabel()
    pBar.hide()*/
  }

  async getScores(locations: LatLngId[]) {
    // Counting the reachable population for each location
    const results = await client.quality.fetch(locations, {
      'stats': {
        type: 'poiCoverageCount',
        osmTypes: [
            {
                'key': 'shop',
                'value': "supermarket"
            }
        ],
        maxEdgeWeight: MAX_TRAVEL,
        edgeWeight: EDGE_WEIGHT,
        travelMode: {[TRAVEL_MODE]: {}} as TravelMode,
        coreServiceUrl: 'https://api.targomo.com/britishisles/'
      }
    })
    
    return results.data
  }

  /** True for absolute, false for relative
  */
  scoringSystem = true //toggleScoringSystemBtn.innerHTML == "Absolute"
  toggleScoringSystem() {
      /*scoringSystem = !scoringSystem
      document.getElementById('toggleScoringSystemBtn').innerHTML = scoringSystem ? "Absolute" : "Relative"
      updateLocationLabel()*/
  }

  async updateLocationLabel() {
    var description = ""
    const locations = this.getMarkersLocations()
    const scoresResult = await this.getScores(locations)
    const orderedResult = Object.values(scoresResult).sort((a: LatLngIdScores, b: LatLngIdScores): number => a.scores.stats < b.scores.stats ? 0 : 1)
    let orderedScores = orderedResult.map(k => k.scores.stats)
    const maxScore = Math.max(...orderedScores)
    
    for(let i = 0; i < orderedResult.length; i++) {
        let val = 0
        let id = orderedResult[i].id
        if(this.scoringSystem) {
            val = orderedScores[i]
        } else {
            val = (orderedScores[i])*100/maxScore
        }
        description += "<div class='location "
        if(this.selectedLocation != undefined && this.selectedLocation == id) {
            description += "selected-location "
        }
        description += "'data-marker-index="+id+" onclick='selectMarker(" + id + ")'><span>Marker " + (parseInt(id)+1) + "</span>"
        
        if(this.scoringSystem) {
            description += "<div class='absolute-rating'>" + val + "</div>"
        } else {
            description += "<div class='rating'>" + val + "</div>"
        }
         
        description += "<br></div></div>"
    }

    document.getElementById("locations-content")!.innerHTML = description
    this.updateRatingsCircles()
  }

  getMarkersLocations(): LatLngId[] {
    let locations: LatLngId[] = []
    this.sourceMarkers.forEach((marker, index) => {
        locations[index] = { ... marker.getLngLat(), id: index }
    })
    return locations
  }


  /*
  Conic gradients are not supported in all browsers (https://caniuse.com/#feat=css-conic-gradients), so this pen includes the CSS conic-gradient() polyfill by Lea Verou (https://leaverou.github.io/conic-gradient/)
  */
  updateRatingsCircles() {
    // Find al rating items
    const ratings = document.querySelectorAll(".rating");

    // Iterate over all rating items
    ratings.forEach((rating) => {
        // Get content and get score as an int
        const ratingContent = rating.innerHTML;
        const ratingScore = parseInt(ratingContent, 10);

        // Define if the score is good, meh or bad according to its value
        const scoreClass =
            ratingScore < 40 ? "bad" : ratingScore < 60 ? "meh" : "good";

        // Add score class to the rating
        rating.classList.add(scoreClass);

        // After adding the class, get its color
        const ratingColor = window.getComputedStyle(rating).backgroundColor;

        // Define the background gradient according to the score and color
        const gradient = `background: conic-gradient(${ratingColor} ${ratingScore}%, transparent 0 100%)`;

        // Set the gradient as the rating background
        rating.setAttribute("style", gradient);

        // Wrap the content in a tag to show it above the pseudo element that masks the bar
        rating.innerHTML = `<span>${ratingScore}${
            ratingContent.indexOf("%") >= 0 ? "%" : ""
        }</span>`;
    });
  }

}
