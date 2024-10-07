import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Monitor', url: '/folder/pages/monitor', icon: 'bar-chart' },
  ];
  public labels = [];
  constructor() {}
}
