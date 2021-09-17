import { Component } from '@angular/core';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-reset-btn',
  templateUrl: './reset-btn.component.html',
  styleUrls: ['./reset-btn.component.css']
})
export class ResetBtnComponent {
  constructor(private map: MapService) { }

  onReset() {
    this.map.reset()
  }
}
