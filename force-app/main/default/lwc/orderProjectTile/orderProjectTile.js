import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderProjectTile extends NavigationMixin(LightningElement) {
    
    @api title = 'Order Projects';
    @api description = 'Zamówienia projektów';
    
    handleTileClick() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Order_Project__c' 
            }
        });
    }

    handleDirectNavigation() {
        window.open('/order-project', '_self');
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