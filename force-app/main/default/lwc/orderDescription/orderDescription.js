import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import DESCRIPTION_FIELD from '@salesforce/schema/Order_Request__c.Description__c';

export default class OrderDescription extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [DESCRIPTION_FIELD] })
    order;

    get description() {
        return getFieldValue(this.order.data, DESCRIPTION_FIELD) || 'Brak opisu';
    }
}
