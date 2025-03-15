import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css'
})
export class CommentModalComponent {

  @Input() comments: any[] = [];
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    console.log('Comments:', this.comments);
  }

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
