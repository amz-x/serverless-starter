import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthenticatorService } from '@aws-amplify/ui-angular';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

@Component({
  selector:   'app-root',
  templateUrl: 'app.component.html',
  styleUrls:  ['app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Serverless Starter';

  constructor(private router: Router, private titleService: Title, private iconSetService: IconSetService, public authenticator: AuthenticatorService) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
