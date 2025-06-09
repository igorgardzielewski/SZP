import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ORDER_STATUS_FIELD from '@salesforce/schema/Order_Request__c.Order_Status__c';
import SUBMISSION_DATE_FIELD from '@salesforce/schema/Order_Request__c.Submission_Date__c';
import PLANNED_COMPLETION_FIELD from '@salesforce/schema/Order_Request__c.Planned_Completion__c';

const FIELDS = [ORDER_STATUS_FIELD, SUBMISSION_DATE_FIELD, PLANNED_COMPLETION_FIELD];

export default class OrderStatusBar extends LightningElement {
    @api recordId;
    
    @wire(CurrentPageReference)
    pageRef;
    
    get effectiveRecordId() {
        return this.recordId || this.pageRef?.state?.id || this.pageRef?.state?.recordId;
    }
    
    @wire(getRecord, { recordId: '$effectiveRecordId', fields: FIELDS })
    order;
    
    get orderStatus() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, ORDER_STATUS_FIELD);
        }
        return null;
    }
    
    get submissionDate() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, SUBMISSION_DATE_FIELD);
        }
        return null;
    }
    
    get plannedCompletion() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, PLANNED_COMPLETION_FIELD);
        }
        return null;
    }
    
    get statusSteps() {
        const steps = [
            { label: 'Nowe', value: 'nowe', isActive: false, isCompleted: false },
            { label: 'Zatwierdzone', value: 'zatwierdzone', isActive: false, isCompleted: false },
            { label: 'W trakcie', value: 'w_trakcie', isActive: false, isCompleted: false },
            { label: 'Gotowe do odbioru', value: 'gotowe', isActive: false, isCompleted: false },
            { label: 'Zakończone', value: 'zakonczone', isActive: false, isCompleted: false }
        ];
        
        const currentStatus = this.orderStatus?.toLowerCase();
        let foundCurrent = false;
        
        return steps.map(step => {
            const stepStatus = step.value.toLowerCase();
            let updatedStep;
            
            if (stepStatus === currentStatus) {
                foundCurrent = true;
                updatedStep = { ...step, isActive: true };
            } else if (!foundCurrent) {
                updatedStep = { ...step, isCompleted: true };
            } else {
                updatedStep = step;
            }
            
            // Add labelClass property based on step state
            updatedStep.labelClass = this.getStepClass(updatedStep);
            
            return updatedStep;
        });
    }
    
    get progressPercentage() {
        const currentStatus = this.orderStatus?.toLowerCase();
        const statusMap = {
            'nowe': 20,
            'zatwierdzone': 40,
            'w_trakcie': 60,
            'gotowe': 80,
            'zakonczone': 100
        };
        
        return statusMap[currentStatus] || 0;
    }
    
    getStepClass(step) {
        if (step.isActive) {
            return 'step-label-active';
        } else if (step.isCompleted) {
            return 'step-label-completed';
        } else {
            return 'step-label-inactive';
        }
    }
    
    get progressVariant() {
        const percentage = this.progressPercentage;
        if (percentage === 100) return 'success';
        if (percentage >= 60) return 'warning';
        if (percentage >= 20) return 'brand';
        return 'base';
    }
    
    get isLoading() {
        return !this.order?.data && !this.order?.error && this.effectiveRecordId;
    }
    
    get hasError() {
        return this.order?.error;
    }
    
    get daysRemaining() {
        if (!this.plannedCompletion) return null;
        
        const today = new Date();
        const planned = new Date(this.plannedCompletion);
        const diffTime = planned - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    get timelineStatus() {
        const days = this.daysRemaining;
        if (days === null) return null;
        
        if (days < 0) return { text: `Opóźnienie: ${Math.abs(days)} dni`, variant: 'error' };
        if (days === 0) return { text: 'Termin dzisiaj', variant: 'warning' };
        if (days <= 3) return { text: `Pozostało ${days} dni`, variant: 'warning' };
        return { text: `Pozostało ${days} dni`, variant: 'success' };
    }
}