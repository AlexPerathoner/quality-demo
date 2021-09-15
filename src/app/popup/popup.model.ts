
export class PopupModel {
    constructor(public title1: string, public title2: string, public btnTitle: string, btnClicked) {
        this.btnClicked = btnClicked
    }

    btnClicked = () => {}
}