import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorComponent } from './pages/monitor/monitor.component';

const routes: Routes = [
  {
    path: '',
    component: MonitorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
