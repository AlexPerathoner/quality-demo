import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'option-btn',
  templateUrl: './option-btn.component.html',
  styleUrls: ['./option-btn.component.css']
})
export class OptionBtnComponent {
  @Input() isSelected: boolean
  @Input() name: string
  @Input() iconName: string
  @Output() clicked = new EventEmitter<string>()

  constructor() { }

  onClick() {
    this.clicked.emit(this.name.toLowerCase())
  }
}
