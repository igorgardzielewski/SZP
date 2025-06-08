import { LightningElement, api, wire } from 'lwc';
import getComments from '@salesforce/apex/ClientCommentController.getComments';

export default class ClientComments extends LightningElement {
    @api recordId;
    comments;
    error;
    hasNoComments = false;

    @wire(getComments, { orderId: '$recordId' })
    wiredComments({ error, data }) {
        if(data) {
            this.comments = data;
            this.error = undefined;
            this.hasNoComments = data.length === 0;
        } else if(error) {
            this.error = error;
            this.comments = undefined;
            this.hasNoComments = false;
        }
    }
}
