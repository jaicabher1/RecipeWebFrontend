import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../../services/message/message.service';
import { UserService } from '../../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent {
  @Input() user: any;
  @Output() messageSent = new EventEmitter<void>();

  myUser: any;
  messageText: string = '';

  constructor(private messageService: MessageService, private userService: UserService) {
    this.myUser = this.userService.getMyUser();
  }

  sendMessage(): void {
    const trimmedText = this.messageText.trim();
    if (!trimmedText) return;

    const message = {
      emitter: this.myUser._id,
      receiver: this.user._id,
      text: this.messageText,
      viewed: 'false',
      created_at: new Date()
    };

    this.messageService.sendMessage(message).subscribe(
      response => {
        this.messageText = '';
        this.messageSent.emit();
      },
      error => console.error('Error enviando mensaje', error)
    );
  }
}
