import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Order_Request__c.Account__r.Name';
import PROJECT_TITLE_FIELD from '@salesforce/schema/Order_Request__c.ProjectTitle__c';
import ORDER_STATUS_FIELD from '@salesforce/schema/Order_Request__c.Order_Status__c';

const FIELDS = [
    ACCOUNT_NAME_FIELD,
    PROJECT_TITLE_FIELD,
    ORDER_STATUS_FIELD
];

export default class OrderDetails extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getRecord, { recordId: '$effectiveRecordId', fields: FIELDS })
    order;
    
    get accountName() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, ACCOUNT_NAME_FIELD);
        }
        return '';
    }
    
    get projectTitle() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, PROJECT_TITLE_FIELD);
        }
        return '';
    }
    
    get orderStatus() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, ORDER_STATUS_FIELD);
        }
        return '';
    }
    
    get isLoading() {
        return !this.order?.data && !this.order?.error && this.effectiveRecordId;
    }
}