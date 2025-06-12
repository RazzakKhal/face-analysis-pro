import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paywall',
  templateUrl: './paywall.page.html',
  styleUrls: ['./paywall.page.scss'],
  standalone: false
})
export class PaywallPage implements OnInit {

  yearlyPlan = false;
  weeklyPlan = true;
  freeTrial = true;

  constructor() { }

  ngOnInit() {
  }

  selectedPlan(plan: string){
    if(plan === "weekly"){
      this.weeklyPlan = true;
      this.yearlyPlan = false;
    }else{
      this.weeklyPlan = false;
      this.yearlyPlan = true;
    }
  }

  freeTrialToggle(){
    this.freeTrial = !this.freeTrial
    console.log('free trial : ', this.freeTrial)
  }
}
