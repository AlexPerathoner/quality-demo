
export class PopupModel {
  
  constructor(public title1: string, public title2: string, public btnTitle: string, btnClicked: () => void, public isEnabled: boolean, public tooltip: string) {
    this.btnFunction = btnClicked
  }

  handleBtnClicked(): void {
    if(this.isEnabled) {
      this.btnFunction()
    } else {
      alert(this.tooltip)
    }
  }
  private btnFunction: () => void = () => {
    throw new Error('Button callback function should be defined')
  }

}
