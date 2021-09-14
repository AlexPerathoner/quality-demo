
export class PopupModel {
    constructor(public title: string, public btnTitle: string, btnClicked) {
        this.btnClicked = btnClicked
    }

    btnClicked = () => {}
}