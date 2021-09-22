import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.css']
})
export class BtnComponent {
  @Input() iconName = ''

  @Output() clicked = new EventEmitter()

  onClick(): void {
    this.clicked.emit('')
  }

}
