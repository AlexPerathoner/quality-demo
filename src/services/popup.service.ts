import { Injectable } from '@angular/core';

@Injectable()
export class PopupService {

  constructor(private title1: string, private title2: string, private buttonText: string) { }


  makePopup(): Node {
    const root = document.createElement('div')
    root.innerHTML = `
        <div id="cdk-overlay-0" class="container" #container>
          <div class="location ng-star-inserted">
            <mat-icon role="img" class="mat-icon notranslate material-icons-round mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">location_on</mat-icon>
            <span class="title-line-1">` + this.title1 + `</span>
            <span class="title-line-2">` + this.title2 + `</span>
          </div>
          <div class="button-container ng-star-inserted">
            <button color="primary" id="add-marker-btn" class="standard-button add-marker-btn mat-focus-indicator mat-flat-button mat-button-base mat-primary ng-star-inserted">
              <span class="mat-button-wrapper">` + this.buttonText + `</span>
              <span matripple="" class="mat-ripple mat-button-ripple">
              </span>
              <span class="mat-button-focus-overlay"></span>
            </button>
          </div>
        </div>`
    return root
  }
}
