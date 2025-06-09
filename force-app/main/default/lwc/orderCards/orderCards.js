import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOrders from '@salesforce/apex/OrderController.getOrders';

export default class OrderCards extends NavigationMixin(LightningElement) {
    _orders;
    ordersWithStyle;
    error;

    @wire(getOrders)
    wiredOrders({ error, data }) {
        if (data) {
            this.ordersWithStyle = data.map(order => {
                let style = this.getStyleForStatus(order.Order_Status__c);
                return { ...order, ...style };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.ordersWithStyle = undefined;
        }
    }

    getStyleForStatus(status) {
        switch (status) {
            case 'End':
                return { iconName: 'utility:check', sldsClass: 'slds-theme_success' };
            case 'In process':
                return { iconName: 'utility:clock', sldsClass: 'slds-theme_warning' };
            case 'Canceled':
                return { iconName: 'utility:close', sldsClass: 'slds-theme_error' };
            case 'New':
                return { iconName: 'utility:new', sldsClass: 'slds-theme_info' };
            case 'Waiting to accept':
                return { iconName: 'utility:hourglass', sldsClass: 'slds-theme_info' };
            default:
                return { iconName: 'utility:info', sldsClass: 'slds-theme_default' };
        }
    }

    handleClick(event) {
        const recordId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'orderDetailView__c'
            },
            state: {
                recordId: recordId
            }
        });
    }
}