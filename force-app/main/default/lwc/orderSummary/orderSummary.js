import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Pola do pobrania
import ACCOUNT_FIELD from '@salesforce/schema/Order_Request__c.Account__c';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Order_Request__c.Account__r.Name';
import CONTACT_FIELD from '@salesforce/schema/Order_Request__c.Contact_Person__c';
import CONTACT_NAME_FIELD from '@salesforce/schema/Order_Request__c.Contact_Person__r.Name';
import PROJECT_TITLE_FIELD from '@salesforce/schema/Order_Request__c.ProjectTitle__c';
import ORDER_STATUS_FIELD from '@salesforce/schema/Order_Request__c.Order_Status__c';

export default class OrderSummary extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [
            ACCOUNT_FIELD,
            ACCOUNT_NAME_FIELD,
            CONTACT_FIELD,
            CONTACT_NAME_FIELD,
            PROJECT_TITLE_FIELD,
            ORDER_STATUS_FIELD
        ]
    })
    order;

    get accountName() {
        return getFieldValue(this.order.data, ACCOUNT_NAME_FIELD) || '-';
    }
    get contactName() {
        return getFieldValue(this.order.data, CONTACT_NAME_FIELD) || '-';
    }
    get projectTitle() {
        return getFieldValue(this.order.data, PROJECT_TITLE_FIELD) || '-';
    }
    get orderStatus() {
        return getFieldValue(this.order.data, ORDER_STATUS_FIELD) || '-';
    }
}
