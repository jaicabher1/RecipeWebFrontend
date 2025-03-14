import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SendMessageComponent } from "./send-message/send-message.component";

@Component({
  selector: 'app-messages',
  imports: [ChatDetailComponent, FormsModule, CommonModule, SendMessageComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  searchTerm: string = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  myUser: any;
  messages: any[] = [];
  messageText: string = '';

  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit(): void {
    this.myUser = this.userService.getMyUser();
    this.loadUsersMessages();
    this.loadReceivedMessages();
  }

  //Funcion auxiliar para añadir un usuario a la lista de usuarios filtrados
  addUniqueUser(userList: any[], userToAdd: any): void {
    const exists = userList.some(u => u._id === userToAdd._id);
    if (!exists) {
      userList.push(userToAdd);
    }
  }
  
  loadUsersMessages() {
    this.messageService.getMyMessages().subscribe(
      response => {
        console.log(response);
        for (let message of response.messages) {
          this.addUniqueUser(this.filteredUsers, message.receiver);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  loadReceivedMessages() {
    this.messageService.getReceivedMessages().subscribe(
      response => {
        console.log(response);
        for (let message of response.messages) {
          this.addUniqueUser(this.filteredUsers, message.emitter);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }
}

