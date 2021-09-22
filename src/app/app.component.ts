import { Component } from '@angular/core';
import { MapService } from 'services/map.service';
import { NamedLatLngIdScores } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quality-demo';
  settingsModalIsVisible = false
  selectedLocation: NamedLatLngIdScores

  constructor(private mapService: MapService) { }

  selectLocation(event) {
    this.selectedLocation = event
    if(event) {
      this.mapService.showPoiLayer(event)
    } else {
      this.mapService.hidePoiLayer()
    }
  }
  
}
