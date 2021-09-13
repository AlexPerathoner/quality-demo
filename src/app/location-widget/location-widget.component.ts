import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, Input, NgZone, OnInit, Optional, SkipSelf } from '@angular/core';
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
  private selectedLocation: string | null = null
  locations: LatLngIdScores[] = []
  private useAbsoluteScores = false

  constructor(private quality: QualityRequest, private map: MapService, private ref: ChangeDetectorRef) {
    ref.detach()
  }

  public async onToggleScoringSystem(event: MatSlideToggleChange) {
    this.useAbsoluteScores = event.checked
    
    this.locations.forEach((elem) => { // Immediately putting empty data
      elem.scores.stats = null
    })
    
    this.ref.detectChanges() // Immediately updating toggle btn
    this.updateLocations() // Asynchronously updating data
  }

  ngOnInit(): void {
    this.updateLocations()
    this.map.getMarkerUpdateListener()
      .subscribe(async (newLocations: LatLngId[]) => {
        this.locations = await this.calculateLocationScores(newLocations)
        this.ref.detectChanges()
      })
    this.map.getMarkerSelectListener()
      .subscribe((markerId: string) => {
        this.selectMarker(markerId)
      })
  }

  async updateLocations() {
    this.locations = await this.calculateLocationScores(this.map.getMarkersLocations())
    this.ref.detectChanges()
  }

  async calculateLocationScores(sourceLocations: LatLngId[]): Promise<LatLngIdScores[]> {
    const scoresResult = await this.quality.getScores(sourceLocations)
    const orderedResult = Object.values(scoresResult).sort((a: LatLngIdScores, b: LatLngIdScores): number => a.scores.stats > b.scores.stats ? 0 : 1)
    let orderedScores = orderedResult.map(k => k.scores.stats)
    const maxScore = Math.max(...orderedScores)
    
    if(!this.useAbsoluteScores) {
      for(let i = 0; i < orderedResult.length; i++) {
        orderedResult[i].scores.stats = Math.round((orderedScores[i])*100/maxScore)
      }
    }
    return orderedResult
  }


  public selectMarker(markerIndex: string) {
    this.selectedLocation = markerIndex
    this.map.flyToMarker(markerIndex)
    this.ref.detectChanges()
  }

}
