import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#register', () => {
    it('should POST user data', () => {
      const mockUser = new User('', 'Test', '', 'test@email.com', 'test', '1234', 'ROLE_USER');

      service.register(mockUser).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}register`);
      expect(req.request.method).toBe('POST');
      req.flush({ user: mockUser });
    });

    it('should handle HTTP error in register', () => {
      const mockUser = new User('', 'Test', '', 'test@email.com', 'test', '1234', 'ROLE_USER');

      service.register(mockUser).subscribe({
        next: () => fail(),
        error: (err) => expect(err.status).toBe(500)
      });

      const req = httpMock.expectOne(`${service['url']}register`);
      req.flush('error', { status: 500, statusText: 'Error' });
    });
  });

  describe('#login', () => {
    it('should save token in localStorage', () => {
      const mockResponse = { token: 'abc.def.ghi' };

      service.login('test@email.com', '1234').subscribe(res => {
        expect(res.token).toBe('abc.def.ghi');
        expect(localStorage.getItem('authToken')).toBe('abc.def.ghi');
      });

      const req = httpMock.expectOne(`${service['url']}login`);
      req.flush(mockResponse);
    });
  });

  describe('#logout', () => {
    it('should remove token and navigate', () => {
      localStorage.setItem('authToken', 'fake');
      service.logout();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('#isAuthenticated & getToken', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('authToken', 'token');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getToken()).toBe('token');
    });

    it('should return false if token does not exist', () => {
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.getToken()).toBeNull();
    });
  });

  describe('#getMyUser', () => {
    it('should decode token and return user', () => {
      const payload = {
        sub: '1',
        name: 'Juan',
        surname: 'Pérez',
        email: 'juan@test.com',
        nick: 'juan',
        password: '1234',
        role: 'ROLE_USER',
        bio: 'bio',
        location: 'ES',
        isVerified: true,
        image: 'img.jpg',
        phoneNumber: '+34611222333'
      };
      const encodedPayload = btoa(JSON.stringify(payload));
      const fakeToken = `aaa.${encodedPayload}.zzz`;

      localStorage.setItem('authToken', fakeToken);
      const user = service.getMyUser();

      expect(user).toBeTruthy();
      expect(user?.email).toBe(payload.email);
    });

    it('should return null if token is invalid', () => {
      localStorage.setItem('authToken', 'malformado.token');
      expect(service.getMyUser()).toBeNull();
    });
  });

  describe('#getUserById', () => {
    it('should GET user with token', () => {
      localStorage.setItem('authToken', 'token');

      service.getUserById('123').subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}user/123`);
      expect(req.request.headers.get('Authorization')).toBe('token');
      req.flush({ user: {} });
    });

    it('should fail if no token', () => {
      service.getUserById('123').subscribe({
        next: () => fail(),
        error: err => expect(err.message).toContain('No token')
      });
    });
  });

  describe('#uploadImage', () => {
    it('should send FormData with token', () => {
      localStorage.setItem('authToken', 'token');
      const file = new File(['img'], 'img.jpg', { type: 'image/jpeg' });

      service.uploadImage('123', file).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}upload-image-user/123`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush({ image: 'img.jpg' });
    });
  });
});
