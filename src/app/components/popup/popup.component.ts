import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  message: string | null = null;
  type: string = '';
  show: boolean = false;

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupService.message$.subscribe(popup => {
      if (popup) {
        this.message = popup.message;
        this.type = popup.type;
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 7000);
      } else {
        this.show = false;
      }
    });
  }
}
