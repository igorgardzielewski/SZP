import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ORDER_STATUS_FIELD from '@salesforce/schema/Order_Request__c.Order_Status__c';
import PROJECT_TITLE_FIELD from '@salesforce/schema/Order_Request__c.ProjectTitle__c';

const FIELDS = [ORDER_STATUS_FIELD, PROJECT_TITLE_FIELD];

export default class OrderTasksNavigation extends NavigationMixin(LightningElement) {
    @api recordId;
    @api buttonVariant = 'brand';
    @api buttonSize = 'medium';
    @api showTaskCount = false;
    
    taskCount = 0;
    isLoadingTasks = false;
    
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
    
    get projectTitle() {
        if (this.order?.data) {
            return getFieldValue(this.order.data, PROJECT_TITLE_FIELD);
        }
        return 'Zamówienie';
    }
    
    get isButtonDisabled() {
        return !this.effectiveRecordId || this.order?.error;
    }
    
    get buttonLabel() {
        if (this.isLoadingTasks) {
            return 'Ładowanie...';
        }
        
        if (this.showTaskCount && this.taskCount > 0) {
            return `Przejdź do zadań (${this.taskCount})`;
        }
        
        return 'Przejdź do zadań';
    }
    
    get buttonIcon() {
        return this.isLoadingTasks ? 'utility:spinner' : 'utility:task';
    }
    
    get cardTitle() {
        return `Zadania - ${this.projectTitle}`;
    }
    
    get statusMessage() {
        const status = this.orderStatus?.toLowerCase();
        
        switch (status) {
            case 'nowe':
                return 'Zamówienie oczekuje na rozpoczęcie prac';
            case 'zatwierdzone':
                return 'Zamówienie zostało zatwierdzone - można rozpocząć zadania';
            case 'w_trakcie':
                return 'Prace są w toku - sprawdź postęp zadań';
            case 'gotowe':
                return 'Wszystkie zadania zostały ukończone';
            case 'zakonczone':
                return 'Zamówienie zostało zakończone';
            default:
                return 'Sprawdź status zadań dla tego zamówienia';
        }
    }
    
    get statusVariant() {
        const status = this.orderStatus?.toLowerCase();
        
        switch (status) {
            case 'nowe':
                return 'inverse';
            case 'zatwierdzone':
                return 'brand';
            case 'w_trakcie':
                return 'warning';
            case 'gotowe':
                return 'success';
            case 'zakonczone':
                return 'success';
            default:
                return 'neutral';
        }
    }
    
    handleNavigateToTasks() {
        if (!this.effectiveRecordId) {
            this.showToast('Błąd', 'Brak identyfikatora zamówienia', 'error');
            return;
        }
        
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'orderTasks__c'
            },
            state: {
                recordId: this.effectiveRecordId,
                orderTitle: this.projectTitle
            }
        });
        

    }
    
    handleQuickActions(event) {
        const action = event.target.dataset.action;
        
        switch (action) {
            case 'newTask':
                this.createNewTask();
                break;
            case 'viewAll':
                this.handleNavigateToTasks();
                break;
            case 'refresh':
                this.refreshTaskCount();
                break;
        }
    }
    
    createNewTask() {
        console.log('Creating new task for recordId:', this.effectiveRecordId);
        
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Project_Task__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: {
                    
                    Order_Request__c: this.effectiveRecordId,
                
                    Name: `Zadanie dla: ${this.projectTitle}`
                }
            }
        });
    }
    
    refreshTaskCount() {
        this.isLoadingTasks = true;

        setTimeout(() => {
            this.taskCount = Math.floor(Math.random() * 10) + 1;
            this.isLoadingTasks = false;
        }, 1000);
    }
    
    showToast(title, message, variant) {
        console.log(`${variant.toUpperCase()}: ${title} - ${message}`);
    }
    
    connectedCallback() {
        if (this.showTaskCount) {
            this.refreshTaskCount();
        }
    }
}