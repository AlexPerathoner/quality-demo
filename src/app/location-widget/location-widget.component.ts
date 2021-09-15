import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationWidgetComponent implements OnInit {
  private selectedLocation: string | null = null
  locations: LatLngIdScores[] = []
  useAbsoluteScores = false
  isShowingLoadingLabel = false
  
  @ViewChild('loadingLabel') loadingLabel;
  @ViewChild('relativeBtn') relativeBtn;
  @ViewChild('absoluteBtn') absoluteBtn;

  constructor(private quality: QualityRequest, private map: MapService, private ref: ChangeDetectorRef) {
    ref.detach()
  }

  showRelativeScores() {
    this.useAbsoluteScores = false
    this.relativeBtn.nativeElement.classList.add('selected-button')
    this.absoluteBtn.nativeElement.classList.remove('selected-button')
    this.toggleScoringSystem()
  }
  showAbsoluteScores() {
    this.useAbsoluteScores = true
    this.absoluteBtn.nativeElement.classList.add('selected-button')
    this.relativeBtn.nativeElement.classList.remove('selected-button')
    this.toggleScoringSystem()
  }

  public async toggleScoringSystem() {
    this.showLoadingLabel()
    
    this.locations.forEach((elem) => { // Immediately putting empty data
      elem.scores.stats = null
    })
    
    this.ref.detectChanges() // Immediately updating toggle btn
    this.updateLocations() // Asynchronously updating data
  }

  private showLoadingLabel() {
    this.isShowingLoadingLabel = true
  }

  private hideLoadingLabel() {
    this.isShowingLoadingLabel = false
  }

  ngOnInit(): void {
    this.updateLocations()
    this.map.getMarkerUpdateListener()
      .subscribe(async (newLocations: LatLngId[]) => {
        this.showLoadingLabel()
        this.locations = await this.calculateLocationScores(newLocations)
        this.hideLoadingLabel()
        this.ref.detectChanges()
      })
    this.map.getMarkerSelectListener()
      .subscribe((markerId: string) => {
        this.selectMarker(markerId)
      })
  }

  async updateLocations() {
    this.locations = await this.calculateLocationScores(this.map.getMarkersLocations())
    this.hideLoadingLabel()
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


  public selectMarker(markerId: string) {
    this.selectedLocation = markerId
    this.map.selectMarker(markerId)
    this.ref.detectChanges()
  }

}
