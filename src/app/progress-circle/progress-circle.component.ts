import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.css']
})
export class ProgressCircleComponent {

  @Input() value = 0
  
}
