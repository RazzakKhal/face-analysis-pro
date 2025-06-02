import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
        this.initializeApp();
  }



  async initializeApp() {
    await this.platform.ready();

    // Option sûre : désactiver l’overlay
    await StatusBar.setOverlaysWebView({ overlay: false });

    // (facultatif) Ajuster le style de la barre
    await StatusBar.setStyle({ style: Style.Light });
  }
}
