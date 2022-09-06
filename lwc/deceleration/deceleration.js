import { LightningElement, track } from 'lwc';


export default class ButtonGroupBasic extends LightningElement {
    @track checkbox;
    @track Button = true;
    areDetailsVisibleForDeceleration = true;
    areDetailsVisibleForQuiz = false;

    check(event) {
        var check = event.target.checked;
        if (check == true) {
            this.Button = false;
        }
        else {
            this.Button = true;
        }
    }

    handleChange(event) {
        this.areDetailsVisibleForDeceleration = false;
        this.areDetailsVisibleForQuiz = true;
    }
}