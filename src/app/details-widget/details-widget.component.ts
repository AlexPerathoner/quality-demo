import { Component, Input, OnInit } from '@angular/core';
import { NamedLatLngIdScores, NamedMarker } from 'app/types/types';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.css']
})
export class DetailsWidgetComponent implements OnInit {
  title = ""
  id = 0
  isVisible = false

  @Input() location: NamedLatLngIdScores

  constructor(private map: MapService) { }

  ngOnInit(): void {
    /*this.map.getMarkerSelectionListener()
      .subscribe((marker) => {
        if(marker) {
          this.title = marker.name
          this.id = marker.id
          this.isVisible = true
        } else {
          this.isVisible = false
        }
      })*/
  }

}
