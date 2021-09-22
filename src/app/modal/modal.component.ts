import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnChanges {
  @Input() isVisible = false
  @Input() name: string
  @Input() showHeader = true
  @Input() isModalOrDialog = 'modal'
  @Output() closeClicked = new EventEmitter()

  ngOnChanges(): void {
    if(this.isVisible) {
      this.setupCloseListeners()
    } else {
      this.removeListeners()
    }
  }

  onClose(): void {
    this.closeClicked.emit('')
  }

  handleClick: (event: MouseEvent) => void = (event) => {
    if (event.target == document.querySelector('.'+this.isModalOrDialog+'.is-visible')) {
      this.onClose()
    }
  }

  handleKeystroke: (event: KeyboardEvent) => void  = (event) => {
    if (event.key == 'Escape' && document.querySelector('.'+this.isModalOrDialog+'.is-visible')) {
      this.onClose()
    }
  }

  private removeListeners(): void {
    document.removeEventListener('click', this.handleClick)
    document.removeEventListener('keyup', this.handleKeystroke)
  }

  private setupCloseListeners(): void {
    document.addEventListener('click', this.handleClick)
    document.addEventListener('keyup', this.handleKeystroke)        
  }

}
