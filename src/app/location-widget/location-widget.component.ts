import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { LatLngIdScores } from '@targomo/core';
import { NamedLatLngId, NamedLatLngIdScores, NamedMarker } from 'app/types/types';
import { MapService } from 'services/map.service';
import { QualityService } from 'services/quality.service';


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
  private selectedLocationId: number | null = null
  locations: NamedLatLngIdScores[] = []
  useAbsoluteScores = false

  @Output() selectedMarker = new EventEmitter<NamedLatLngIdScores>()
  
  @ViewChild('relativeBtn') relativeBtn;
  @ViewChild('absoluteBtn') absoluteBtn;

  constructor(private mapService: MapService, private qualityService: QualityService, private ref: ChangeDetectorRef) {
    ref.detach()
  }

  ngOnInit(): void {
    this.updateLocations()
    this.mapService.getMarkerUpdateListener()
      .subscribe(async (newLocations) => {
        this.locations = await this.calculateLocationScores(newLocations)
        if(this.selectedLocationId) {
          this.selectedMarker.emit(this.locations.find(e => e.id == this.selectedLocationId))
        }
        this.ref.detectChanges()
      })
    this.mapService.getMarkerSelectionListener()
      .subscribe((marker) => {
        this.handleSelectionMarker(marker)
      })
  }

  async updateLocations() {
    this.locations = await this.calculateLocationScores(this.mapService.getMarkersLocations())
    this.ref.detectChanges()
  }

  private nameScoredResults(namedLocation: NamedLatLngId[], scoredResults: LatLngIdScores[]): NamedLatLngIdScores[] {
    return scoredResults.map(elem => {
      let name = namedLocation.find(loc => loc.id == elem.id).name
      return {...elem, name: name}
    })
  }

  private normalizeScores(scoredLocations: NamedLatLngIdScores[]): NamedLatLngIdScores[] {
    // Normalizing scores for each criterion
    Object.values(this.qualityService.getOsmTypes()).forEach(osmType => {
      const scores = scoredLocations.map(k => k.scores[osmType.key+"-"+osmType.value])
      const max = Math.max(...scores)
      const min = Math.min(...scores)
      const diff = max-min
      scoredLocations.forEach(location => {
        let normalized = 1
        if(diff != 0) {
          normalized = (location.scores[osmType.key+"-"+osmType.value]-min)/diff 
        }
        location.scores[osmType.key+"-"+osmType.value+"-normalized"] = normalized // Keeping absolute score, saving normalized in new property
      })
    })
    return scoredLocations
  }

  private calculateCombinedScore(scoredLocations: NamedLatLngIdScores[]): NamedLatLngIdScores[] {
    scoredLocations.forEach(location => {
      const individualScores = Object.entries(location.scores)
      let sum = 0
      individualScores.forEach(score => {
        if(score[0].endsWith("-normalized")) { // Only considering normalized scores
          sum += score[1]
        }
      })
      location.scores.combined_score = sum / (individualScores.length/2) // Average of individual normalized scores
    })
    return scoredLocations
  }

  async calculateLocationScores(sourceLocations: NamedLatLngId[]): Promise<NamedLatLngIdScores[]> {
    // Quality request
    const scoresResult = Object.values(await this.qualityService.getScores(sourceLocations))
    // Adding name of markers
    let namedResult = this.nameScoredResults(sourceLocations, scoresResult)
    namedResult = this.normalizeScores(namedResult)
    namedResult = this.calculateCombinedScore(namedResult)
    
    // Ordering
    const orderedResult = namedResult.sort((a: NamedLatLngIdScores, b: NamedLatLngIdScores): number => a.scores.combined_score > b.scores.combined_score ? -1 : 1)
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
    this.selectedLocationId = null
    this.selectedMarker.emit(null)
  }

  onLocationClicked(markerId: number) {
    this.mapService.selectMarker(markerId)
  }

  selectMarker(markerId: number) {
    this.selectedLocationId = markerId
    this.selectedMarker.emit(this.locations.find(e => e.id == markerId))
    this.ref.detectChanges()  
  }

  deleteMarker(id) {
    this.mapService.removeMarker(id)
  }

}
