public without sharing class Quiz {
@AuraEnabled(cacheable=true)
 public static List<Contact> listOfContacts(String Email, String PhoneNumber){
    List<Contact> contList = [SELECT isActive__c,Email, MobilePhone  FROM Contact where Email = :Email AND MobilePhone = :PhoneNumber AND isActive__c = true];
     return contList;
    }
}