public with sharing class OrderController {
    @AuraEnabled(cacheable=true)
    public static List<Order_Request__c> getOrders() {
        return [
            SELECT Id, Name, Order_Status__c, CreatedDate
            FROM Order_Request__c
            WHERE CreatedById = :UserInfo.getUserId()
            ORDER BY CreatedDate DESC
            LIMIT 20
        ];
    }
}
