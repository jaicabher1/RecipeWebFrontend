import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../user/user.service';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MessageService,
        { provide: UserService, useValue: spy }
      ]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('#getMyMessages', () => {
    it('debe realizar GET si hay token', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getMyMessages().subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}my-messages`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('token');
      req.flush({ messages: [] });
    });

    it('debe fallar si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.getMyMessages().subscribe({
        next: () => fail('No debería ejecutarse el success'),
        error: (err) => {
          expect(err.message).toContain('No token available');
        }
      });
    });

    it('debe capturar error HTTP en getMyMessages', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getMyMessages().subscribe({
        next: () => fail('No debería llegar al success'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${service['url']}my-messages`);
      req.flush('Error', { status: 500, statusText: 'Error Server' });
    });
  });

  describe('#getReceivedMessages', () => {
    it('debe realizar GET si hay token', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getReceivedMessages().subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}received-messages`);
      expect(req.request.method).toBe('GET');
      req.flush({ messages: [] });
    });

    it('debe fallar si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.getReceivedMessages().subscribe({
        next: () => fail('No debe ejecutarse success'),
        error: err => {
          expect(err.message).toContain('No token available');
        }
      });
    });

    it('debe capturar error HTTP en getReceivedMessages', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getReceivedMessages().subscribe({
        next: () => fail('No debería llegar al success'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${service['url']}received-messages`);
      req.flush('Error', { status: 500, statusText: 'Error Server' });
    });
  });

  describe('#sendMessage', () => {
    const mockMessage = { text: 'Hola', emitter: '1', receiver: '2' };

    it('debe realizar POST correctamente', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.sendMessage(mockMessage).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}send-message`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain('"text":"Hola"');
      req.flush({ success: true });
    });

    it('debe fallar si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.sendMessage(mockMessage).subscribe({
        next: () => fail('No debe ejecutarse'),
        error: err => {
          expect(err.message).toContain('No token available');
        }
      });
    });

    it('debe capturar error HTTP en sendMessage', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.sendMessage(mockMessage).subscribe({
        next: () => fail('No debe pasar'),
        error: err => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${service['url']}send-message`);
      req.flush('Error', { status: 500, statusText: 'Error' });
    });
  });
});
