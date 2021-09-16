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

  async calculateLocationScores(sourceLocations: NamedLatLngId[]): Promise<NamedLatLngIdScores[]> {
    const scoresResult = Object.values(await this.quality.getScores(sourceLocations))
    let namedResult: NamedLatLngIdScores[] = scoresResult.map(elem => {
      let name = sourceLocations.find(loc => loc.id == elem.id).name
      return {...elem, name: name}
    }) 

    const orderedResult = namedResult.sort((a: NamedLatLngIdScores, b: NamedLatLngIdScores): number => a.scores.stats > b.scores.stats ? 0 : 1)
    let orderedScores = orderedResult.map(k => k.scores.stats)
    const maxScore = Math.max(...orderedScores)
    
    if(!this.useAbsoluteScores) {
      for(let i = 0; i < orderedResult.length; i++) {
        orderedResult[i].scores.stats = Math.round((orderedScores[i])*100/maxScore)
      }
    }
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
