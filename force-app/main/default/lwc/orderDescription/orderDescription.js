import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import DESCRIPTION_FIELD from '@salesforce/schema/Order_Request__c.Description__c';

export default class OrderDescription extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getRecord, { recordId: '$effectiveRecordId', fields: [DESCRIPTION_FIELD] })
    order;
    
    get description() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, DESCRIPTION_FIELD) || 'Brak opisu';
        }
        return this.order?.error ? 'Błąd ładowania danych' : 'Ładowanie...';
    }
    
    get hasError() {
        return this.order?.error;
    }
    
    get isLoading() {
        return !this.order?.data && !this.order?.error;
    }
}