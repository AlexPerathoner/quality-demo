import { Component, Input, OnInit, Output } from '@angular/core';
import { NamedLatLngIdScores, NamedMarker } from 'app/types/types';
import { QualityRequest } from 'services/quality-requests.service';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.css']
})
export class DetailsWidgetComponent {
  @Input() location: NamedLatLngIdScores

  constructor(public quality: QualityRequest) { }

}
