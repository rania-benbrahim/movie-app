import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stars',
  imports: [],
  templateUrl: './stars.html',
  styleUrl: './stars.css',
})
export class Stars {
  @Input() value: number = 0;        // note sur 5 (ex : 3.5)
  @Input() size: number = 16;        // taille en pixels
  @Input() editable: boolean = false; // true = on peut cliquer pour noter
  @Output() rate = new EventEmitter<number>();

  positions = [1, 2, 3, 4, 5];
  hovered = 0;

  state(position: number): string {
    const note = this.hovered || this.value;
    if (note >= position) {
      return 'full';
    }
    if (note >= position - 0.5) {
      return 'half';
    }
    return 'empty';
  }

  onHover(position: number) {
    if (this.editable) {
      this.hovered = position;
    }
  }

  onLeave() {
    this.hovered = 0;
  }

  select(position: number) {
    if (this.editable) {
      this.rate.emit(position);
    }
  }
}
