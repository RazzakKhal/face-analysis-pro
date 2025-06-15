import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { PaymentService } from './handlers/payment.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private paymentService: PaymentService) {
  }
  async ngOnInit(): Promise<void> {
    await this.initializeApp();
  }



  async initializeApp() {
    await this.platform.ready();

    // Option sûre : désactiver l’overlay
    await StatusBar.setOverlaysWebView({ overlay: false });

    // (facultatif) Ajuster le style de la barre
    await StatusBar.setStyle({ style: Style.Light });
    await this.paymentService.initializePurchases();
    if (await this.paymentService.checkPremium()) {
      this.paymentService.isCustomerSubject.next(true)
    } else {
      const restored = await this.paymentService.restorePurchases();

      if (restored) {
        this.paymentService.isCustomerSubject.next(true)
      } 
    }
  }
}
