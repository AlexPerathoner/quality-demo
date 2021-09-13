import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'loading-label',
  templateUrl: './loading-label.component.html',
  styleUrls: ['./loading-label.component.css'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        top: '-1.5rem',
        opacity: 1,
      })),
      state('closed', style({
        top: '-4rem',
        opacity: 0.6,
      })),
      transition('open => closed', [
        animate('0.07s')
      ]),
      transition('closed => open', [
        animate('0.07s')
      ]),
    ]),
  ],
})
export class LoadingLabelComponent {
  @Input() isOpen = false;

  constructor() { }

  toggle() {
    this.isOpen = !this.isOpen
  }
}
