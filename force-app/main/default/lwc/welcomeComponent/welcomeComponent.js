import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import FIRST_NAME_FIELD from '@salesforce/schema/User.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/User.LastName';

const FIELDS = [NAME_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD];

export default class WelcomeComponent extends LightningElement {
    @api showCard = false;
    @api customMessage = '';
    
    userId = Id;
    
    @wire(getRecord, { recordId: '$userId', fields: FIELDS })
    user;
    
    get username() {
        if (this.user?.data) {
            // Możesz wybrać które pole użyć:
            // return getFieldValue(this.user.data, NAME_FIELD); // Pełna nazwa
            const firstName = getFieldValue(this.user.data, FIRST_NAME_FIELD);
            const lastName = getFieldValue(this.user.data, LAST_NAME_FIELD);
            
            // Zwróć tylko imię lub pełną nazwę
            return firstName || getFieldValue(this.user.data, NAME_FIELD) || 'Użytkowniku';
        }
        return 'Użytkowniku';
    }
    
    get isLoading() {
        return !this.user?.data && !this.user?.error;
    }
    
    get hasError() {
        return !!this.user?.error;
    }
    
    get welcomeMessage() {
        if (this.customMessage) {
            return this.customMessage.replace('{username}', this.username);
        }
        return `Witaj, ${this.username}!`;
    }
    
    connectedCallback() {
        console.log('Welcome component loaded for user:', this.userId);
    }
    
    // Opcjonalna metoda do wyświetlania toastu powitalnego
    showWelcomeToast() {
        const event = new ShowToastEvent({
            title: 'Witamy!',
            message: `Witaj w systemie, ${this.username}!`,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}