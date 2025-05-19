import { Component, Input, OnChanges, SimpleChanges, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message/message.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css']
})
export class ChatDetailComponent implements OnChanges, AfterViewChecked {
  @Input() user: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  myUser: any;
  messages: any[] = [];
  messageText: string = '';
  private shouldScrollToBottom = true;

  constructor(private messageService: MessageService, private userService: UserService) {
    this.myUser = this.userService.getMyUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user?._id) {
      this.loadMessagesWithUser();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadMessagesWithUser(): void {
 
    this.messageService.getMyMessages().subscribe(
      sent => {
        this.messageService.getReceivedMessages().subscribe(
          received => {  
            const allMessages = [...sent.messages, ...received.messages];
    
            this.messages = allMessages.filter(msg => {
                return (
                (msg.emitter === this.myUser._id && msg.receiver._id === this.user._id) ||
                (msg.receiver === this.myUser._id && msg.emitter._id === this.user._id)
              );
            }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            this.shouldScrollToBottom = true;
          },
          err => console.error('Error al obtener mensajes recibidos:', err)
        );
      },
      err => console.error('Error al obtener mensajes enviados:', err)
    );
  }
  

  scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
