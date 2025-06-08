trigger SendMailAfterStatusChange on Order_Request__c (after update) {
    List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();

    for (Order_Request__c ord : Trigger.new) {
        Order_Request__c oldOrd = Trigger.oldMap.get(ord.Id);

        // Sprawdź, czy status się zmienił
        if (ord.Order_Status__c != oldOrd.Order_Status__c && ord.Contact_Person__c != null) {
            // Pobierz email kontaktu
            Contact contact = [SELECT Email FROM Contact WHERE Id = :ord.Contact_Person__c LIMIT 1];

            if (contact.Email != null) {
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setToAddresses(new String[] { contact.Email });
                email.setSubject('Zmieniono status Twojego zamówienia');
                email.setPlainTextBody(
                    'Cześć! Status Twojego zamówienia "' + ord.Name + '" został zmieniony na: ' + ord.Order_Status__c
                );
                emailsToSend.add(email);
            }
        }
    }

    if (!emailsToSend.isEmpty()) {
        Messaging.sendEmail(emailsToSend);
    }
}