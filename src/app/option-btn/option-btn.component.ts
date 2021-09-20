import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QualityRequest } from 'services/quality-requests.service';

@Component({
  selector: 'option-btn',
  templateUrl: './option-btn.component.html',
  styleUrls: ['./option-btn.component.css']
})
export class OptionBtnComponent {

  @Input() name: string
  @Input() iconName: string
  @Output() clicked = new EventEmitter<string>()

  constructor(private quality: QualityRequest) {
  }

  onClick() {
    this.clicked.emit(this.name.toLowerCase())
  }

  isSelected() {
    return this.name.toLowerCase() == this.quality.travelMode
  }

}
