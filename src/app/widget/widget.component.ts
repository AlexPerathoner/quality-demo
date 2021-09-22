import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.css']
})
export class WidgetComponent {
  @Input() id = ''
  @Input() title = ''
  @Input() scrollable = false
  
}
