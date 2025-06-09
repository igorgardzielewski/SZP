import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import SUBMISSION_DATE_FIELD from '@salesforce/schema/Order_Request__c.Submission_Date__c';
import PLANNED_COMPLETION_FIELD from '@salesforce/schema/Order_Request__c.Planned_Completion__c';

const FIELDS = [SUBMISSION_DATE_FIELD, PLANNED_COMPLETION_FIELD];

export default class OrderDates extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getRecord, { recordId: '$effectiveRecordId', fields: FIELDS })
    order;
    get submissionDate() {
        return this.order?.data ? getFieldValue(this.order.data, SUBMISSION_DATE_FIELD) : null;
    }

    get plannedCompletion() {
        return this.order?.data ? getFieldValue(this.order.data, PLANNED_COMPLETION_FIELD) : null;
    }

    get recordIdDebug() {
        return this.recordId || 'recordId is empty';
    }
}
