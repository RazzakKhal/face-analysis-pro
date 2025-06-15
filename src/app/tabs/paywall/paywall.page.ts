import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { PurchasesOfferings, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { PaymentService } from 'src/app/handlers/payment.service';

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
  subscriptions : PurchasesOfferings | undefined;
  actualSub : PurchasesPackage | undefined | null;

  constructor(private paymentService : PaymentService, private router: Router) { }

  async ngOnInit() {
     this.subscriptions = await this.paymentService.getOfferings();
     this.actualSub = this.subscriptions?.current?.weekly
  }

  selectedPlan(plan: string){
    if(plan === "weekly"){
      this.weeklyPlan = true;
      this.yearlyPlan = false;
      this.actualSub = this.subscriptions?.current?.weekly
      this.freeTrial = true;
    }else{
      this.weeklyPlan = false;
      this.yearlyPlan = true;
      this.actualSub = this.subscriptions?.current?.annual
      this.freeTrial = false;
    }
  }

  freeTrialToggle(){
    this.freeTrial = !this.freeTrial
  }

  async makePurchase(){
    if(this.actualSub){
     const result = await this.paymentService.purchase(this.actualSub)
     if(result){
      this.paymentService.isCustomerSubject.next(true)
      this.router.navigateByUrl('/tabs/report')
     }
    }else{
      console.error("no sub selected")
    }
  }

  async restoreSubscription(){
    const restore = await this.paymentService.restorePurchases();
    if(restore){
      this.paymentService.isCustomerSubject.next(true)
      this.router.navigateByUrl('/tabs/report')
    }
  }

  async openLegalPage() {
  await Browser.open({
    url: 'https://cypress-iguanadon-dd1.notion.site/Privacy-Policy-Terms-Conditions-Face-Analysis-Pro-21393dc01c3380ec82b1f7c8383f2112'
  });
}
}
