import { Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
  @Input()
  id: string = ""

  @Input()
  title: string = ""

  @Input()
  useHeader = true

  @Input()
  options: {name: string, id: string}[] = []

  constructor(private map: MapService) {}

  public toggle(event: MatSlideToggleChange) {
    const senderId = event.source.id
    const val = event.checked
    
    if(senderId == "absoluteScoresBtn") {
      this.map.useAbsoluteScores = val
    }
    
    
  }

  
}
