import { Component, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'app-settings-btn',
    templateUrl: './settings-btn.component.html',
    styleUrls: ['./settings-btn.component.css']
})
export class SettingsBtnComponent {
  @Output() clicked = new EventEmitter()

  showSettings() {
      this.clicked.emit('')
  }
}
