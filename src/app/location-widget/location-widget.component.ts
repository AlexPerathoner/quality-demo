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
    this.updateLocationsScores()
  }
  

  constructor(private quality: QualityRequest, private map: MapService) {
    map.locationsWidget = this
  }

  public toggleScoringSystem(event: MatSlideToggleChange) {
    this.useAbsoluteScores = event.checked
  }

  ngOnInit(): void {
    
  }

  async updateLocationsScores() {

    const sourceLocations = this.map.getMarkersLocations()
    const scoresResult = await this.quality.getScores(sourceLocations)
    const orderedResult = Object.values(scoresResult).sort((a: LatLngIdScores, b: LatLngIdScores): number => a.scores.stats > b.scores.stats ? 0 : 1)
    let orderedScores = orderedResult.map(k => k.scores.stats)
    const maxScore = Math.max(...orderedScores)
    
    for(let i = 0; i < orderedResult.length; i++) {
      if(!this.useAbsoluteScores) {
        orderedResult[i].scores.stats = Math.round((orderedScores[i])*100/maxScore)
      }
    }
    
    this.locations = orderedResult
    console.log(this.locations.map(elem => elem.scores.stats))
    
  }


  public selectMarker(markerIndex: string) {
    this.selectedLocation = markerIndex
    this.map.flyToMarker(parseInt(markerIndex)-1)
    
  }

}
