import { LightningElement, track, api, wire } from "lwc";
import getQuestionAnswerForQuiz from "@salesforce/apex/GetQuestionAnswerForQuiz.getQuestionAnswerForQuiz";

export default class MyWorld extends LightningElement {
  @track disablePrev = true;
  @track disableNext = false;
  @track disableSubmit = true;
  @track areResultVisible = false;
  @track areQUizVisible = true;
  @track booleanFlag = false;
  @track cancelSubmit = false;
  @track correctAnswerList = [];
  @track selectedOptionMap = new Map();
  @track options = [];
  @track optionForEachQuest = [];
  @track value;
  @track selectedOptionList = [];
  @track array1;
  @track array2;
  @track marks1 = 0;
  @track currentQues = 0;
  @track currentId = 1;
  @track allQuestions;
  @track questionsToDisplay;
  @track correctAnswer;
  @track optionToDisplay;
  @track selectedOption;
  @track error;
  @track lastId;
  @track progress;
  @track timeVal = '0:0:0';
  @track timeIntervalInstance;
  totalMilliseconds = 2000//1.8e+6;
  @api marks;
  @api totalMarks;

  @wire(getQuestionAnswerForQuiz)
  questionsList({ error, data }) {
    if (data) {
      this.lastId = data.length;
      this.progress = 100 / this.lastId;
      this.allQuestions = data;
      this.questionsToDisplay = [this.allQuestions[this.currentQues]];
      this.correctAnswer = this.allQuestions[this.currentQues].correctAnswer;
      this.optionToDisplay = this.allQuestions[this.currentQues].optionList;
      this.optionForEachQuest = this.options;
      for (let j = 0; j < 4; j++) {
        this.options.push({ label: this.optionToDisplay[j].Name, value: this.optionToDisplay[j].Name });
      }
      for (let i = 0; i < this.lastId; i++) {
        this.correctAnswerList.push(this.allQuestions[i].correctAnswer);
      }

    } else if (error) {
      console.log(error);
      this.error = error;
    }
  }

  handleNext() {
    this.currentId = this.currentId + 1;
    this.currentQues = this.currentQues + 1;
    this.questionsToDisplay = [this.allQuestions[this.currentQues]];
    this.optionToDisplay = this.allQuestions[this.currentQues].optionList;
    this.optionForEachQuest = [];
    for (let j = 0; j < this.optionToDisplay.length; j++) {
      this.optionForEachQuest.push({ label: this.optionToDisplay[j].Name, value: this.optionToDisplay[j].Name });
    }
    this.progress = this.progress + 100 / this.lastId;
    for (let [k,v] of this.selectedOptionMap) {
      if(k == (this.currentQues)){
        this.value = v;
    }
    }
  }

  handlePrev() {
    this.currentId = this.currentId - 1;
    this.currentQues = this.currentQues - 1;
    this.questionsToDisplay = [this.allQuestions[this.currentQues]];
    this.optionToDisplay = this.allQuestions[this.currentQues].optionList;
    this.optionForEachQuest = [];
    for (let j = 0; j < this.optionToDisplay.length; j++) {
      this.optionForEachQuest.push({ label: this.optionToDisplay[j].Name, value: this.optionToDisplay[j].Name });
    }
    this.progress = this.progress - 100 / this.lastId;
    for (let [k,v] of this.selectedOptionMap) {
      if(k == (this.currentQues)){
        this.value = v;
    }
    }
}

  renderedCallback() {
    if (this.currentId == this.lastId) {
      this.disableNext = true;
      this.disableSubmit = false;
    }
    else if (this.currentId == 1 && this.lastId != 1) {
      this.disablePrev = true;
    }
    else if (this.currentId != 1) {
      this.disablePrev = false;
      this.disableNext = false;
    }
  }

  connectedCallback() {
    var parentThis = this;
    this._interval = setInterval(() => {
      // Run timer code in every 100 milliseconds
      // Time calculations for hours, minutes, seconds
      var hours = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000);

      // Output the result in the timeVal variable
      parentThis.timeVal = hours + ":" + minutes + ":" + seconds;
      parentThis.totalMilliseconds -= 1000;
      if (parentThis.timeVal == 0 + ":" + 0 + ":" + 0) {
        this.booleanFlag = true;
        this.cancelSubmit  = true;
        this.submitQuiz();
      }
    }, 1000);
  }

  handleRadioChange(event) {
    this.selectedOption = event.target.value;
    this.selectedOptionMap.set(this.currentQues, this.selectedOption);
  }

  submitQuiz() {
    for (var valuee of this.selectedOptionMap.values()) {
      this.selectedOptionList.push(valuee);
    }
    this.array1 = this.selectedOptionList;
    this.array2 = this.correctAnswerList;

    for (var i = 0; i < this.array2.length; i++) {
      if (this.array1[i] == this.array2[i]) {
        //console.log(" this.selectedOptionList " + this.array1);
       // console.log(" this.correctAnswerList " + this.array2);
        this.marks1 = this.marks1 + 1;
      }
    }

    if (this.booleanFlag == false) {
      if(confirm("Are you sure to submit the test?")){
        this.cancelSubmit = true;
      }
    }
    if(this.cancelSubmit  == true){
    this.areQUizVisible = false;
    this.areResultVisible = true;
    this.marks = this.marks1;
    this.totalMarks = this.lastId;
    clearInterval(this._interval);
  }
  }

  handleResetAll() {
    this.value = null;
    this.selectedOptionMap.put(this.currentQues,null);
  }
}