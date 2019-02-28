import { Component, ViewChild } from '@angular/core';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isCameraAuthorized: boolean = false;

  scannedValue: string = '';

  constructor(
    private qrScanner: QRScanner
  ) {
    // Constructor.
  }

  /**
  * Quand on entre dans la page on charge la caméra.
  */
  ionViewWillEnter() {
    this.initialize();
  }

  /**
  * Quand on quitte la page, on cache la caméra.
  */
  ionViewWillLeave() {
    this.hideCamera();
  }

  /**
  * Chargement du demande et demande de la permission.
  */
  async initialize() {
    try {
      // On demande la permission de la caméra à l'utilisateur.
      // Un object est retourné "{authorized: boolean}".
      const getStatus: QRScannerStatus = await this.qrScanner.prepare();
      console.log('getStatus', getStatus);
      this.isCameraAuthorized = getStatus.authorized;

      // Si autorisé.
      if (!getStatus.authorized) {
        this.onPermissionDenied();
      }
      // Si refusé.
      else {
        this.onPermissionGranted();
      }
    } catch (onError) {
      this.isCameraAuthorized = false;
    }
  }

  /**
  * Effectue l'action du scan : 
  * La valeur récupéré du qr code est dans la variable "nextScanText"
  */
  scan() {
    if (this.isCameraAuthorized) {
      const scanSub = this.qrScanner.scan().subscribe((nextScanText: string) => {
        this.scannedValue = nextScanText;

        console.log('nextScanText', nextScanText);
       // Retire la caméra.
       this.qrScanner.hide();
       // Arrête l'état de scan de la camera.
       scanSub.unsubscribe();
      });
    }
  }

  /**
  * Action à réaliser si l'utilisateur a autorisé la caméra.
  */
  onPermissionGranted() {
    console.log('la caméra est autorisée à être utilisée.');
    this.showCamera();
    this.scan();
  }

  /**
  * Action à réaliser si l'utilisateur n'a pas autorisé la caméra.
  */
  onPermissionDenied() {
    console.log('la caméra n\'est pas autorisée à être utilisée.');
  }

  /**
  * Afficher la caméra.
  */
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  /**
  * Masquer la caméra.
  */
  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }
}
