import { Injectable } from '@angular/core';
import { Purchases, CustomerInfo, LOG_LEVEL, PurchasesOfferings, PurchasesPackage, MakePurchaseResult } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private isConfigured = false;
  isCustomerSubject = new BehaviorSubject<boolean>(false);

  constructor() {
  }

   async initializePurchases() {
    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      
      const api_key = Capacitor.getPlatform() === 'ios' ? "appl_JJXWtWZqpxYDhhXHdCbBrwwoOTl" : "clé_android";

      await Purchases.configure({
        apiKey: api_key
      });
      this.isConfigured = true;
      console.log('✅ RevenueCat initialized');
    } catch (error) {
      console.error('❌ RevenueCat initialization failed', error);
    }
  }

  async getOfferings() : Promise<PurchasesOfferings | undefined> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not initialized yet');
    }
    try {
      return await Purchases.getOfferings();
    } catch (error) {
      console.error('Error getting offerings', error);
      return undefined;
    }
  }

  async purchase(offer : PurchasesPackage): Promise<boolean> {
    try {
       await Purchases.purchasePackage({
        aPackage: offer
      });
      return true;
    } catch (error) {
      console.error('Purchase error', error);
      return false;
    }
  }

 

  async restorePurchases(): Promise<boolean> {
    try {
      const result = await Purchases.restorePurchases();
      return await this.hasPremiumAccess(result.customerInfo);
    } catch (error) {
      console.error('Error restoring purchases', error);
      throw error;
    }
  }

   async checkPremium(): Promise<boolean> {
    try {
      const result = await Purchases.getCustomerInfo();
      return await this.hasPremiumAccess(result.customerInfo);
    } catch (error) {
      console.error('Error checking premium status', error);
      return false;
    }
  }
  
  private async hasPremiumAccess(customerInfo: CustomerInfo): Promise<boolean> {
       await Purchases.syncPurchases(); // gère le cas ou l'utilisateur s'est desabonné et n'a pas supprimé l'appli
    // Vérifie si "premium" est actif dans les entitlements OU s'il y a un abonnement actif
    return (
      customerInfo.entitlements?.active?.['Pro']?.isActive === true ||
      (customerInfo.activeSubscriptions && customerInfo.activeSubscriptions.length > 0)
    );
  }

}
