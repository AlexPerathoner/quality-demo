import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.css']
})
export class BtnComponent implements OnInit {
  @Input() iconName = ""
  constructor() { }

  @Output() clicked = new EventEmitter()

  onClick() {
    this.clicked.emit("")
  }

  ngOnInit(): void {
    
  }

}
