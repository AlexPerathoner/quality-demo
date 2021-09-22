import { Component } from '@angular/core'
import { NamedLatLngIdScores } from './types/types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quality-demo';
  settingsModalIsVisible = false
  selectedLocation: NamedLatLngIdScores

  selectLocation(event: NamedLatLngIdScores): void {
    this.selectedLocation = event
  }
  
}
