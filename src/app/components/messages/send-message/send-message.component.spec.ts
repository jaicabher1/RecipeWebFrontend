import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMessageComponent } from './send-message.component';
import { MessageService } from '../../../services/message/message.service';
import { UserService } from '../../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../models/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SendMessageComponent', () => {
  let component: SendMessageComponent;
  let fixture: ComponentFixture<SendMessageComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser = new User(
    '1', 'John', 'Doe', 'john@test.com', 'johndoe', '12345678',
    'ROLE_USER', '', '', false, '', ''
  );

  const mockReceiver = new User(
    '2', 'Jane', 'Smith', 'jane@test.com', 'janesmith', 'password123',
    'ROLE_USER', '', '', false, '', ''
  );

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['sendMessage']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser']);

    // Mocking the UserService to return mockUser
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [SendMessageComponent, HttpClientTestingModule],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SendMessageComponent);
    component = fixture.componentInstance;

    // Setting the receiver user (the one who will receive the message)
    component.user = mockReceiver;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar mensaje si el texto está vacío', () => {
    component.messageText = '   ';
    component.sendMessage();
    expect(messageServiceSpy.sendMessage).not.toHaveBeenCalled();
  });

  it('debe enviar mensaje válido y emitir evento', () => {
    component.messageText = 'Hola!';
    const emitSpy = spyOn(component.messageSent, 'emit');
    messageServiceSpy.sendMessage.and.returnValue(of({}));

    component.sendMessage();

    expect(messageServiceSpy.sendMessage).toHaveBeenCalledWith(jasmine.objectContaining({
      emitter: '1', // Mocked user ID
      receiver: '2', // Mocked receiver ID
      text: 'Hola!'
    }));
    expect(component.messageText).toBe('');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe manejar error al enviar mensaje', () => {
    component.messageText = 'Hola!';
    
    // Usamos throwError para simular un error en el servicio
    messageServiceSpy.sendMessage.and.returnValue(throwError(() => new Error('Error en el servicio')));
  
    spyOn(console, 'error');  // Mocking console.error to check if it gets called on error
    component.sendMessage();
  
    // Verificamos que el error sea capturado
    expect(console.error).toHaveBeenCalledWith('Error enviando mensaje', jasmine.any(Error));
  });
  
});
