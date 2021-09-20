import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'poi-selection-dialog',
  templateUrl: './poi-selection-dialog.component.html',
  styleUrls: ['./poi-selection-dialog.component.css']
})
export class PoiSelectionDialogComponent {
  @Input() isVisible = false
  @Output() closeClicked = new EventEmitter()

  onClose() {
    this.closeClicked.emit("")
  }

}
