import { Component } from '@angular/core'
import { PopupModel } from './popup.model'

@Component({
  selector: 'map-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  public model: PopupModel;

  onClick(): void {
    this.model.handleBtnClicked()
  }

}
