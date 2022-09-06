import { LightningElement,api } from 'lwc';

export default class QuizResult extends LightningElement {
    @api marksobtained;
    @api total;
}