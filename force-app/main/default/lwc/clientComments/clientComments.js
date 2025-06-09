import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getComments from '@salesforce/apex/ClientCommentController.getComments';

export default class ClientComments extends LightningElement {
    @api recordId;
    comments;
    error;
    isLoading = false;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getComments, { orderId: '$effectiveRecordId' })
    wiredComments({ error, data }) {
        this.isLoading = false;
        
        if (data) {
            this.comments = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.comments = undefined;
            console.error('Error loading comments:', error);
        }
    }
    
    get hasComments() {
        return this.comments && this.comments.length > 0;
    }
    
    get hasNoComments() {
        return this.comments && this.comments.length === 0;
    }
    
    get hasError() {
        return this.error;
    }
    
    get hasNoRecordId() {
        return !this.effectiveRecordId;
    }
    
    get errorMessage() {
        if (this.error) {
            return this.error.body?.message || this.error.message || 'Nieznany błąd';
        }
        return '';
    }
    
    connectedCallback() {
        this.isLoading = true;
    }
}