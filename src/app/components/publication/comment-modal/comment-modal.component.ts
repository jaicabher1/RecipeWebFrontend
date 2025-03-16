import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicationService } from '../../../services/publication/publication.service';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css'
})
export class CommentModalComponent {

  @Input() comments: any[] = [];
  @Input() publicationId = '';
  @Output() close = new EventEmitter<void>();
  messageText = '';

  constructor(private publicationService: PublicationService) {}

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

  sendComment(): void {
    console.log(this.publicationId);
     this.publicationService.sendComment(this.publicationId, this.messageText).subscribe(
       response => {
         console.log('Comentario enviado:', response);
         this.messageText = '';
       },
       error => {
         console.error('Error al enviar comentario:', error);
       }
     );
    
  }

  deleteComment(commentId: string): void {
    this.publicationService.deleteComment(commentId).subscribe(
      response => {
        const comment = this.comments.find(c => c._id === commentId);
        if (comment) {
          // Cambiar el texto del comentario al instante
          comment.text = '💬 Este comentario ha sido eliminado.';
  
          // Esperar 2 segundos y cerrar el modal automáticamente
          setTimeout(() => {
            this.onClose(); // o this.close.emit();
          }, 2000);
        }
      },
      error => {
        console.error('Error al eliminar comentario:', error);
      }
    );
  }
  
  
  
}
