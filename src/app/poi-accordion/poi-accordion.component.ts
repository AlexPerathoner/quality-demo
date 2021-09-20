import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PoiType } from '@targomo/core';

@Component({
  selector: 'poi-accordion',
  templateUrl: './poi-accordion.component.html',
  styleUrls: ['./poi-accordion.component.css'],
})
export class PoiAccordionComponent {

  @Input() poiList: PoiType[]
  allChecked = false
  checked = {}

  constructor() { }

  onClick(key, value) {
    console.log("hey");
  }

  onGroupClicked(key) {
    console.log(key);
    
    if(this.checked[key]) {
      this.checked[key] = false
    } else {
      this.checked[key] = true
    }
    console.log(this.checked)
  }
}
