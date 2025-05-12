import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { of, throwError } from 'rxjs';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser = new User(
    '1', 'John', 'Doe', 'john@test.com', 'johndoe', '12345678',
    'ROLE_USER', '', '', false, '', ''
  );

  const mockUser2 = new User(
    '1234', 'Jaime', 'CH', 'jaime@test.com', 'jaimee', '12345679',
    'ROLE_USER', '', '', false, '', ''
  );

  const mockMessages = {
    messages: [
      { emitter: mockUser2, receiver: mockUser },
      { emitter: mockUser, receiver: mockUser2 }
    ]
  };

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'getMyMessages',
      'getReceivedMessages',
      'sendMessage'
    ]);
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getMyUser',
      'getAllUsers'
    ]);

    await TestBed.configureTestingModule({
      imports: [MessagesComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;

    userServiceSpy.getMyUser.and.returnValue(mockUser);
    messageServiceSpy.getMyMessages.and.returnValue(of(mockMessages));
    messageServiceSpy.getReceivedMessages.and.returnValue(of(mockMessages));
    userServiceSpy.getAllUsers.and.returnValue(of({ users: [mockUser2] }));
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar mensajes y usuarios', () => {
    component.ngOnInit();
    expect(component.myUser).toEqual(mockUser);
    expect(messageServiceSpy.getMyMessages).toHaveBeenCalled();
    expect(messageServiceSpy.getReceivedMessages).toHaveBeenCalled();
    expect(userServiceSpy.getAllUsers).toHaveBeenCalled();
  });

  it('debe manejar errores al cargar mensajes', () => {
    messageServiceSpy.getMyMessages.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    expect(messageServiceSpy.getMyMessages).toHaveBeenCalled();
  });

  it('addUniqueUser evita duplicados', () => {
    const list = [{ _id: '1234' }];
    component.addUniqueUser(list, { _id: '1234' });
    expect(list.length).toBe(1);
    component.addUniqueUser(list, { _id: '9999' });
    expect(list.length).toBe(2);
  });

  it('selectUser actualiza selectedUser', () => {
    component.selectUser(mockUser2);
    expect(component.selectedUser).toEqual(mockUser2);
  });

  it('openNewChatModal reinicia campos correctamente', () => {
    component.openNewChatModal();
    expect(component.showNewChatModal).toBeTrue();
    expect(component.newChatSearch).toBe('');
    expect(component.selectedNewUser).toBeNull();
  });

  it('sendFirstMessage no hace nada si falta usuario o texto', () => {
    component.myUser = mockUser;
    component.firstMessageText = '';
    component.selectedNewUser = mockUser2;
    component.sendFirstMessage();
    expect(messageServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('sendFirstMessage funciona correctamente', () => {
    component.myUser = mockUser;
    component.selectedNewUser = mockUser2;
    component.firstMessageText = 'Hola!';
    messageServiceSpy.sendMessage.and.returnValue(of({}));

    component.sendFirstMessage();

    expect(messageServiceSpy.sendMessage).toHaveBeenCalled();
    expect(component.filteredUsers).toContain(mockUser2);
    expect(component.selectedUser).toEqual(mockUser2);
    expect(component.showNewChatModal).toBeFalse();
  });

  it('filteredAllUsers devuelve lista filtrada sin duplicados', () => {
    component.allUsers = [mockUser2];
    component.filteredUsers = [];
    component.newChatSearch = 'jaime';
    expect(component.filteredAllUsers.length).toBe(1);
  });

  it('trackByUserId devuelve el _id', () => {
    const id = component.trackByUserId(0, mockUser2);
    expect(id).toBe('1234');
  });
});
