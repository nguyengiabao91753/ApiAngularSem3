import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetService } from '../service/AssetService.service';
import { HeadertopComponent } from "./partials/headertop/headertop.component";
import { HeaderbotComponent } from "./partials/headerbot/headerbot.component";
import { FooterpartComponent } from "./partials/footerpart/footerpart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeadertopComponent, HeaderbotComponent, FooterpartComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
    constructor(
        private assetService: AssetService
    ){}
    ngOnInit(): void {
        // CSS files
    this.assetService.addCss('client/assets/global/css/bootstrap.min.css');
    this.assetService.addCss('client/assets/global/css/all.min.css');
    this.assetService.addCss('client/assets/global/css/line-awesome.min.css');
    this.assetService.addCss('client/assets/templates/basic/css/flaticon.css');
    this.assetService.addCss('client/assets/templates/basic/css/main43a0.css?v3');
    this.assetService.addCss('client/assets/templates/basic/css/custom43a0.css?v3');
    this.assetService.addCss('client/assets/templates/basic/css/colorf972.css?color=0E9E4D');
    this.assetService.addCss('client/assets/global/css/select2.min.css');
    this.assetService.addCss('client/assets/global/css/daterangepicker.css');
    this.assetService.addCss('client/assets/templates/basic/css/slick.css');
    this.assetService.addCss('client/assets/global/css/client.css');

    // JS files
    // this.assetService.addJs('../cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js');
    this.assetService.addJs('client/assets/global/js/jquery-3.7.1.min.js');
    this.assetService.addJs('client/assets/global/js/bootstrap.bundle.min.js');
    this.assetService.addJs('client/assets/templates/basic/js/main43a0.js?v3');
    this.assetService.addJs('client/assets/global/js/select2.min.js');
    this.assetService.addJs('client/assets/global/js/moment.min.js');
    this.assetService.addJs('client/assets/global/js/daterangepicker.min.js');
    this.assetService.addJs('client/assets/templates/basic/js/slick.min.js');
    this.assetService.addCss('client/assets/global/css/iziToast.min.css');
    this.assetService.addCss('client/assets/global/css/iziToast_custom.css');
    this.assetService.addJs('client/assets/global/js/iziToast.min.js');

    this.assetService.setTitle('Bus Booking')
    }
  
}
