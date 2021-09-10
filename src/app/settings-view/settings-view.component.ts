import { Component, OnInit } from '@angular/core';
import { setTravelMode, TRAVEL_MODE } from 'services/global';
import { MapService } from 'services/map.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {

  constructor(private map: MapService) { }

  changeTravelMode(elem, mode) {
    // changing buttons style
    const features = document.getElementsByClassName('travel-mode-btn')
    for(let i=0; i<features.length; i++) {
      const element = features[i]
        if(elem === element) {
            element.classList.add("selected-button")
        } else {
            element.classList.remove("selected-button")
        }
    }
    setTravelMode(mode)
    this.map.updateMap()
}

  ngOnInit(): void {

    const openEls = document.querySelectorAll("[data-open]");
    const isVisible = "is-visible";
    
    openEls.forEach((el) =>  {
        el.addEventListener("click", function() {
            document.getElementById("modal-settings").classList.add(isVisible);
        });
    });

    const closeEls = document.querySelectorAll("[data-close]");
    
    closeEls.forEach((el) =>  {
        el.addEventListener("click", function() {
            this.parentElement.parentElement.parentElement.classList.remove(isVisible);
        });
    });

    document.addEventListener("click", e => {
        if (e.target == document.querySelector(".modal.is-visible")) {
            document.querySelector(".modal.is-visible").classList.remove(isVisible);
        }
    });

    document.addEventListener("keyup", e => {
        if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
            document.querySelector(".modal.is-visible").classList.remove(isVisible);
        }
    });

  }

}
