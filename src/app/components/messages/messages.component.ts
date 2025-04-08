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
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  myUser: any;
  messages: any[] = [];
  messageText: string = '';

  // NUEVOS CAMPOS para el modal
  showNewChatModal: boolean = false;
  newChatSearch: string = '';
  selectedNewUser: any = null;
  firstMessageText: string = '';

  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit(): void {
    this.myUser = this.userService.getMyUser();
    this.loadUsersMessages();
    this.loadReceivedMessages();
    this.loadAllUsers();
  }

  //Funcion auxiliar para añadir un usuario a la lista de usuarios filtrados
  addUniqueUser(userList: any[], userToAdd: any): void {
    if (!userToAdd) return;
    const exists = userList.some(u => u._id === userToAdd._id);
    if (!exists) {
      userList.push(userToAdd);
    }
  }

  loadUsersMessages() {
    this.messageService.getMyMessages().subscribe(
      response => {
        for (var message of response.messages) {
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

  //Nuevo chat

  loadAllUsers() {
    this.userService.getAllUsers().subscribe(
      (response) => {
        const userList = response.users.filter((u: any) =>
          u._id !== this.myUser._id && !this.filteredUsers.some((fu: any) => fu._id === u._id)
        );
        this.allUsers.push(...userList);
      },
      error => console.error('Error cargando usuarios', error)
    );
  }

  openNewChatModal(): void {
    this.showNewChatModal = true;
    this.newChatSearch = '';
    this.selectedNewUser = null;
    this.firstMessageText = '';
  }

  closeNewChatModal(): void {
    this.showNewChatModal = false;
  }

  selectNewChatUser(user: any): void {
    this.selectedNewUser = user;
  }

  sendFirstMessage(): void {
    const text = this.firstMessageText.trim();
    if (!text || !this.selectedNewUser) return;

    const message = {
      emitter: this.myUser._id,
      receiver: this.selectedNewUser._id,
      text,
      viewed: false,
      created_at: new Date()
    };

    this.messageService.sendMessage(message).subscribe(
      () => {
        this.filteredUsers.push(this.selectedNewUser);
        this.selectedUser = this.selectedNewUser;
        this.closeNewChatModal();
      },
      error => console.error('Error enviando mensaje inicial', error)
    );
  }

  get filteredAllUsers(): any[] {
    // Texto de búsqueda
    const searchTerm = this.newChatSearch.toLowerCase().trim();

    // 1) Excluimos a los usuarios con los que ya hay chat
    const usersWithoutChat = this.allUsers.filter(u =>
      !this.filteredUsers.some(fu => fu._id === u._id)
    );

    // 2) Filtramos por coincidencia en el texto buscado
    return usersWithoutChat.filter(u => {
      const fullName = (u.name + ' ' + u.surname).toLowerCase();
      const nick = (u.nick || '').toLowerCase();

      return fullName.includes(searchTerm) || nick.includes(searchTerm);
    });
  }


  trackByUserId(index: number, user: any): string {
    return user._id;
  }
}

