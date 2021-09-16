import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { LatLngId, LatLngIdScores } from '@targomo/core';
import { NamedLatLngId, NamedLatLngIdScores, NamedMarker } from 'app/types/types';
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
  private selectedLocation: number | null = null
  locations: NamedLatLngIdScores[] = []
  useAbsoluteScores = false
  isShowingLoadingLabel = false

  @Output() selectedMarker = new EventEmitter<NamedLatLngIdScores>()
  
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
      .subscribe(async (newLocations) => {
        this.showLoadingLabel()
        this.locations = await this.calculateLocationScores(newLocations)
        this.hideLoadingLabel()
        this.ref.detectChanges()
      })
    this.map.getMarkerSelectionListener()
      .subscribe((marker) => {
        this.handleSelectionMarker(marker)
      })
  }

  async updateLocations() {
    this.locations = await this.calculateLocationScores(this.map.getMarkersLocations())
    this.hideLoadingLabel()
    this.ref.detectChanges()
  }

  private nameScoredResults(namedLocation: NamedLatLngId[], scoredResults: LatLngIdScores[]): NamedLatLngIdScores[] {
    return [...scoredResults.map(elem => {
      let name = namedLocation.find(loc => loc.id == elem.id).name
      return {...elem, name: name}
    })]
  }

  private normalizeScores(scoredLocations: NamedLatLngIdScores[]): NamedLatLngIdScores[] {
    // Normalizing scores for each criterion
    Object.values(this.quality.osmTypes).forEach(osmType => {
      const scores = scoredLocations.map(k => k.scores[osmType.value])
      const max = Math.max(...scores)
      const min = Math.min(...scores)
      const diff = max-min
      scoredLocations.forEach(location => {
        location.scores[osmType.value] = (location.scores[osmType.value]-min)/diff
      })
    })
    return scoredLocations
  }

  private calculateCombinedScore(scoredLocations: NamedLatLngIdScores[]): NamedLatLngIdScores[] {
    scoredLocations.forEach(location => {
      const individualScores = Object.values(location.scores)
      const sum = individualScores.reduce((a,b) => a+b)
      location.scores.combined_score = sum / individualScores.length // Average of individual scores
    })
    return scoredLocations
  }

  async calculateLocationScores(sourceLocations: NamedLatLngId[]): Promise<NamedLatLngIdScores[]> {
    // Quality request
    const scoresResult = Object.values(await this.quality.getScores(sourceLocations))
    // Adding name of markers
    let namedResult = this.nameScoredResults(sourceLocations, scoresResult)
    namedResult = this.normalizeScores(namedResult)
    namedResult = this.calculateCombinedScore(namedResult)
    
    // Ordering
    const orderedResult = namedResult.sort((a: NamedLatLngIdScores, b: NamedLatLngIdScores): number => a.scores.combined_score > b.scores.combined_score ? 0 : 1)
    return orderedResult
  }


  handleSelectionMarker(marker: NamedMarker) {
    if(marker) {
      this.selectMarker(marker.id)
    } else {
      this.unselectMarker()
    }
    this.ref.detectChanges()
  }

  unselectMarker() {
    this.selectedLocation = null
    this.selectedMarker.emit(null)
  }

  onLocationClicked(markerId: number) {
    this.map.selectMarker(markerId)
    this.selectMarker(markerId)
  }

  selectMarker(markerId: number) {
    this.selectedLocation = markerId
    this.ref.detectChanges()
    this.selectedMarker.emit(this.locations.find(e => e.id == markerId))
  }

}
