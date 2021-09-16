import { Component, Input, OnInit, Output } from '@angular/core';
import { NamedLatLngIdScores, NamedMarker } from 'app/types/types';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.css']
})
export class DetailsWidgetComponent implements OnInit {
  @Input() location: NamedLatLngIdScores

  constructor(private map: MapService) { }

  ngOnInit(): void {
  }

  deleteMarker() {
    this.map.removeMarker(this.location.id)
  }

}
