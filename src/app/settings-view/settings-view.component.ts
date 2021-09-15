import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { setTravelMode } from 'services/global';
import { MapService } from 'services/map.service';
@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnChanges {
    @Input() isVisible = false
    @Output() closeClicked = new EventEmitter()

    constructor(private map: MapService) { }

    ngOnChanges(): void {
        if(this.isVisible) {
            this.setupCloseListeners()
        } else {
            this.removeListeners()
        }
    }

    onClose() {
        this.closeClicked.emit("")
    }

    handleClick = (event) => {
        if (event.target == document.querySelector(".modal.is-visible")) {
            this.onClose()
        }
    }

    handleKeystroke = (event) => {
        if (event.key == "Escape" && document.querySelector(".modal.is-visible")) {
            this.onClose()
        }
    }

    private removeListeners() {
        document.removeEventListener("click", this.handleClick);
        document.removeEventListener("keyup", this.handleKeystroke);
    }

    private setupCloseListeners() {
        document.addEventListener("click", this.handleClick);
        document.addEventListener("keyup", this.handleKeystroke);        
    }

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

}
