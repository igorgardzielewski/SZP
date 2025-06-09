import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

// Pola do pobrania
import ACCOUNT_FIELD from '@salesforce/schema/Order_Request__c.Account__c';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Order_Request__c.Account__r.Name';
import CONTACT_FIELD from '@salesforce/schema/Order_Request__c.Contact_Person__c';
import CONTACT_NAME_FIELD from '@salesforce/schema/Order_Request__c.Contact_Person__r.Name';
import PROJECT_TITLE_FIELD from '@salesforce/schema/Order_Request__c.ProjectTitle__c';
import ORDER_STATUS_FIELD from '@salesforce/schema/Order_Request__c.Order_Status__c';

const FIELDS = [
    ACCOUNT_FIELD,
    ACCOUNT_NAME_FIELD,
    CONTACT_FIELD,
    CONTACT_NAME_FIELD,
    PROJECT_TITLE_FIELD,
    ORDER_STATUS_FIELD
];

export default class OrderSummary extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getRecord, {
        recordId: '$effectiveRecordId',
        fields: FIELDS
    })
    order;
    
    get accountName() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, ACCOUNT_NAME_FIELD) || '-';
        }
        return this.isLoading ? '...' : '-';
    }
    
    get contactName() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, CONTACT_NAME_FIELD) || '-';
        }
        return this.isLoading ? '...' : '-';
    }
    
    get projectTitle() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, PROJECT_TITLE_FIELD) || '-';
        }
        return this.isLoading ? '...' : '-';
    }
    
    get orderStatus() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, ORDER_STATUS_FIELD) || '-';
        }
        return this.isLoading ? '...' : '-';
    }
    
    get hasError() {
        return this.order?.error;
    }
    
    get isLoading() {
        return !this.order?.data && !this.order?.error && this.effectiveRecordId;
    }
    
    get hasNoRecordId() {
        return !this.effectiveRecordId;
    }
}