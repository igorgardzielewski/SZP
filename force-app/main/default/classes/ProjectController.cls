public with sharing class ProjectController {

    @AuraEnabled(cacheable=true)
    public static List<Order_Request__c> getMyProjects(String userId) {
        try {
            return [
                SELECT Id, Name, CreatedDate, LastModifiedDate,
                       Order_Status__c, Description__c, Owner.Name,
                       ProjectTitle__c, Planned_Completion__c, Submission_Date__c,
                       Account__c, Contact_Person__c
                FROM Order_Request__c
                WHERE OwnerId = :userId
                ORDER BY LastModifiedDate DESC
                LIMIT 100
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Błąd podczas pobierania projektów: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getMyProjectsCount(String userId) {
        try {
            return [
                SELECT COUNT()
                FROM Order_Request__c
                WHERE OwnerId = :userId
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Błąd podczas liczenia projektów: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Order_Request__c> getRecentProjects(String userId, Integer limitCount) {
        try {
            return [
                SELECT Id, Name, CreatedDate, Order_Status__c, ProjectTitle__c
                FROM Order_Request__c
                WHERE OwnerId = :userId
                ORDER BY CreatedDate DESC
                LIMIT :limitCount
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Błąd podczas pobierania najnowszych projektów: ' + e.getMessage());
        }
    }
}
