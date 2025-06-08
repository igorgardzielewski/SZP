import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOrders from '@salesforce/apex/OrderController.getOrders';

export default class OrderCards extends NavigationMixin(LightningElement) {
    @wire(getOrders) orders;

    handleClick(event) {
        const recordId = event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage', 
            attributes: {
                name: 'orderDetailView__c' 
            },
            state: {
                id: recordId 
            }
        });
    }
}
