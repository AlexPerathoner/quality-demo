
export class PopupModel {
	constructor(public title1: string, public title2: string, public btnTitle: string, btnClicked, public isEnabled: boolean, public tooltip: string) {
		this.btnFunction = btnClicked
	}

	handleBtnClicked() {
		if(this.isEnabled) {
			this.btnFunction()
		} else {
			alert(this.tooltip);
		}
	}
	private btnFunction = () => {}
}
