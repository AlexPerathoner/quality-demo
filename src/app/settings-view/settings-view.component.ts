import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TravelType } from '@targomo/core';
import { MapService } from 'services/map.service';
import { QualityService } from 'services/quality.service';
@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnChanges {
    @Input() isVisible = false
    @Output() closeClicked = new EventEmitter()

    constructor(private map: MapService, public qualityService: QualityService) { }

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

    changeTravelMode(mode: TravelType) {
        this.qualityService.travelMode = mode
        this.map.updateMap()
    }

    onMaxTravelChanged(event) {
        this.qualityService.maxTravel = event.value
        this.map.updateMap()
    }

}
