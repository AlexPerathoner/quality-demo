import { Component, Input } from '@angular/core'
import { NamedLatLngIdScores } from 'app/types/types'
import { QualityService } from 'services/quality.service'

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.css']
})
export class DetailsWidgetComponent {
  @Input() location: NamedLatLngIdScores

  constructor(public qualityService: QualityService) { }

}
