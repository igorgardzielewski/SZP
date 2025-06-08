import { LightningElement, wire, api } from 'lwc';  // dodaj @api
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
    getPageRef(pageRef) {
        if (pageRef?.state?.id) {
            this.recordId = pageRef.state.id;
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    order;

    get accountName() {
        return getFieldValue(this.order.data, ACCOUNT_NAME_FIELD);
    }

    get projectTitle() {
        return getFieldValue(this.order.data, PROJECT_TITLE_FIELD);
    }

    get orderStatus() {
        return getFieldValue(this.order.data, ORDER_STATUS_FIELD);
    }
}
