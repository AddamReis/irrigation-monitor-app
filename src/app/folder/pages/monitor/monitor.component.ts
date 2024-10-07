import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent  implements OnInit {
  
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.firebaseService.addData('users/user1', { name: 'Addam Reis', age: 28 })
      .then(() => console.log('Dados adicionados com sucesso'))
      .catch(err => console.error('Erro ao adicionar dados', err));
  }
}
