import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import SUBMISSION_DATE_FIELD from '@salesforce/schema/Order_Request__c.Submission_Date__c';
import PLANNED_COMPLETION_FIELD from '@salesforce/schema/Order_Request__c.Planned_Completion__c';

export default class OrderDates extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
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
