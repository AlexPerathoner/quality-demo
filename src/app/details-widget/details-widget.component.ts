import { Component, OnInit } from '@angular/core';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.css']
})
export class DetailsWidgetComponent implements OnInit {
  title = ""
  isVisible = false

  constructor(private map: MapService) { }

  ngOnInit(): void {
    this.map.getMarkerSelectionListener()
      .subscribe((markerId: string) => {
        if(markerId) {
          this.title = markerId
          this.isVisible = true
        } else {
          this.isVisible = false
        }
      })
  }

}
