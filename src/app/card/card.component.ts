import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {

  @Input() icon!: string;
  @Input() title: string = 'Card Title';
  @Input() percentage!: number;
  @Input() width: number = 240;
  @Input() height: number = 240;
  @Output() onClick = new EventEmitter<void>();

  public color!: string;
 
  constructor() { }

  ngOnChanges() {
    if (this.percentage) {
      this.color = this.getColorByPercentage(this.percentage);
    }
  }
  
  onCardClick(): void {
    this.onClick.emit();
  }

  getColorByPercentage(percentage: number): string {
    if (percentage >= 75) {
      return '#7CB342'; // Verde médio
    } else if (percentage >= 70) {
      return '#C0CA33'; // Amarelo esverdeado
    } else if (percentage >= 50) {
      return '#FBC02D'; // Amarelo
    } else if (percentage >= 40) {
      return '#FFA000'; // Laranja amarelado
    } else if (percentage >= 20) {
      return '#E64A19'; // Laranja avermelhado
    } else if (percentage >= 10) {
      return '#D32F2F'; // Vermelho escuro
    } else {
      return '#F44336'; // Vermelho
    }
  }
}
