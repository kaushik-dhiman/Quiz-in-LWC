public without sharing class GetQuestionAnswerForQuiz {
    @AuraEnabled(cacheable=true)
    public static List<QuestionAnswerListWrapper> getQuestionAnswerForQuiz() {
        List<QuestionAnswerListWrapper> quesWrapperList = new List<QuestionAnswerListWrapper> ();       
        for(Question__c quesList : [SELECT Name,Correct_Answer__c, (SELECT toLabel(Name) FROM Answers__r) FROM Question__c]){
            QuestionAnswerListWrapper quesWrapper = new QuestionAnswerListWrapper();
            quesWrapper.question = quesList.Name;
            quesWrapper.correctAnswer = quesList.Correct_Answer__c;
            quesWrapper.optionList = quesList.Answers__r;
            quesWrapperList.add(quesWrapper);
        }
        return quesWrapperList;
    }
    
    // wrapper class with @AuraEnabled
    public class QuestionAnswerListWrapper{
        @AuraEnabled
        public String question{get;set;}
        @AuraEnabled
        public String correctAnswer{get;set;}
        @AuraEnabled
        public List<AnswerOptions__c> optionList{get;set;}
        
    }
}