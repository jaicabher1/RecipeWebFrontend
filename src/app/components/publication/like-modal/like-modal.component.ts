import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-like-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './like-modal.component.html',
  styleUrls: ['./like-modal.component.css']
})
export class LikeModalComponent {
  @Input() likes: any[] = [];
  @Output() close = new EventEmitter<void>();

  // Cierra el modal si se hace clic fuera del contenido
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
