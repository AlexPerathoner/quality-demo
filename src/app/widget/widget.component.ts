import { Component, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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

  public toggle(event: MatSlideToggleChange) {
    const sender = event.source.id
    const val = event.checked
    console.log(sender, val)
    
  }

  
}
