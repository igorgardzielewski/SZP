import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import getMyProjects from '@salesforce/apex/ProjectController.getMyProjects';

export default class UserProjectsTile extends NavigationMixin(LightningElement) {
    
    @api title = 'Twoje zamówione projekty';
    @api description = 'Zobacz wszystkie swoje projekty';
    
    userId = Id;
    projectCount = 0;
    loading = true;
    error;

    // Pobierz liczbę projektów użytkownika
    @wire(getMyProjects, { userId: '$userId' })
    wiredProjects({ error, data }) {
        this.loading = false;
        if (data) {
            this.projectCount = data.length;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.projectCount = 0;
        }
    }

    get displayCount() {
        return this.projectCount > 99 ? '99+' : this.projectCount.toString();
    }

    get hasProjects() {
        return this.projectCount > 0;
    }

    get projectsText() {
        if (this.projectCount === 0) return 'Brak projektów';
        if (this.projectCount === 1) return '1 projekt';
        if (this.projectCount < 5) return `${this.projectCount} projekty`;
        return `${this.projectCount} projektów`;
    }

    handleTileClick() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Ordered_Projects__c' 
            }
        });
    }

    handleCustomPageNavigation() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'my-projects'
            },
            state: {
                userId: this.userId
            }
        });
    }

    // Bezpośrednia nawigacja z URL
    handleDirectNavigation() {
        window.location.href = `/order-project?userId=${this.userId}`;
    }

    handleCreateNew() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Order_project__c',
                actionName: 'new'
            }
        });
    }
}