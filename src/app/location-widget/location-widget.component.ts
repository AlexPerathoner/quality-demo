import { ChangeDetectionStrategy, Component, Injectable, Input, NgZone, OnInit, Optional, SkipSelf } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LatLngId, LatLngIdScores } from '@targomo/core';
import { MapService } from 'services/map.service';
import { QualityRequest } from 'services/quality-requests.service';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-location-widget',
  templateUrl: './location-widget.component.html',
  styleUrls: ['./location-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationWidgetComponent implements OnInit {
  selectedLocation: string | null = null
  locations: LatLngIdScores[] = []
  locationWidgetComponent: LocationWidgetComponent

  private _useAbsoluteScores = false
  get useAbsoluteScores() { return this._useAbsoluteScores; }
  set useAbsoluteScores(value) {
    this._useAbsoluteScores = value
    const sourceLocations = this.map.getMarkersLocations()
    this.updateLocationsScores(sourceLocations)
  }
  

  constructor(private quality: QualityRequest, private map: MapService) {
    map.locationsWidget = this
  }

  public toggleScoringSystem(event: MatSlideToggleChange) {
    this.useAbsoluteScores = event.checked
  }

  ngOnInit(): void {
    
  }

  async updateLocationsScores(sourceLocations: LatLngId[]) {
    const scoresResult = await this.quality.getScores(sourceLocations)
    const orderedResult = Object.values(scoresResult).sort((a: LatLngIdScores, b: LatLngIdScores): number => a.scores.stats > b.scores.stats ? 0 : 1)
    let orderedScores = orderedResult.map(k => k.scores.stats)
    const maxScore = Math.max(...orderedScores)

    
    for(let i = 0; i < orderedResult.length; i++) {
      if(this.useAbsoluteScores) {
        orderedResult[i].scores.stats = (orderedScores[i])*100/maxScore
      }
    }
    this.locations = orderedResult
    this.updateRatingsCircles()
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
