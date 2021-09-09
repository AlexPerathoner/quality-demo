import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-btn',
  templateUrl: './settings-btn.component.html',
  styleUrls: ['./settings-btn.component.css']
})
export class SettingsBtnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // TODO: remove any, fix types
    const openEls: any = document.querySelectorAll("[data-open]");
    const isVisible = "is-visible";
    
    for(const el of openEls) {
      el.addEventListener("click", function() {
        document.getElementById("modal-settings").classList.add(isVisible);
      });
    }

    const closeEls: any = document.querySelectorAll("[data-close]");
    
    for (const el of closeEls) {
      el.addEventListener("click", function() {
        this.parentElement.parentElement.parentElement.classList.remove(isVisible);
      });
    }

    document.addEventListener("click", e => {
      if (e.target == document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
      }
    });

    document.addEventListener("keyup", e => {
      if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
      }
    })
  }

}
