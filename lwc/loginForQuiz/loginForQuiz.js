import { LightningElement, track, api, wire } from 'lwc';
import FiservQuizLogo from '@salesforce/resourceUrl/FiservLOGO';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import listOfContacts from '@salesforce/apex/Quiz.listOfContacts';

export default class synopsis extends LightningElement {
    @track email;
    @track mobile;
    @track areDetailsVisibleForLogin = true;
    @track areDetailsVisibleForDeceleration = false;
    FiserLogo = FiservQuizLogo;
    //@wire (listOfContacts,{Email: '$email', PhoneNumber : '$mobile'}) contacts;

    showToast() {
        const event = new ShowToastEvent({
            title: 'Inserted',
            message: 'Record has been inserted',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    handleChangeRender() {
        this.areDetailsVisibleForLogin = false;
        this.areDetailsVisibleForDeceleration = true;
    }

    handleKeyChange(event) {
        if (event.target.label === 'Phone') {
            this.mobile = event.target.value
            console.log('resultthis.mobile ===> ' + this.mobile);
        } if (event.target.label === 'Email') {
            this.email = event.target.value;
            console.log('resultthis.email ===> ' + this.email);
        }
    }

    saveOnClick() {
        if (this.isInputValid()) {
            listOfContacts({ Email: this.email, PhoneNumber: this.mobile })
                .then((result) => {
                    console.log('result ===> ' + result);
                    if (result.length == 0) {
                        console.log('Length ' + result.length);
                        alert('NO RECORED FOUND');
                    }
                    else {
                        console.log('Length ' + result.length);
                        this.areDetailsVisibleForLogin = false;
                        this.areDetailsVisibleForDeceleration = true;
                    }
                });
        }
    }

    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
}