public with sharing class ClientCommentController {
    @AuraEnabled(cacheable=true)
    public static List<Client_Comment__c> getComments(Id orderId) {
        return [
            SELECT Id, Comment_Text__c, Comment_Date__c
            FROM Client_Comment__c
            WHERE Order__c = :orderId
            ORDER BY Comment_Date__c DESC
            LIMIT 10
        ];
    }
}
