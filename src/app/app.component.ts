import { Component, ContentChildren, QueryList } from '@angular/core';
import { WidgetComponent } from './widget/widget.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quality-demo';
  settingsModalIsVisible = false

  showSettings() {
    this.settingsModalIsVisible = true
  }
  hideSettings() {
    this.settingsModalIsVisible = false
  }
}
