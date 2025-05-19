import { TestBed } from '@angular/core/testing';
import { FollowService } from './follow.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../user/user.service';
import { Follow } from '../../models/follow';

describe('FollowService', () => {
  let service: FollowService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FollowService,
        { provide: UserService, useValue: spy }
      ]
    });

    service = TestBed.inject(FollowService);
    httpMock = TestBed.inject(HttpTestingController);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('#saveFollow', () => {
    it('debe realizar POST correctamente si hay token', () => {
      const mockFollow: Follow = { user: '1', followed: '2' };
      userServiceSpy.getToken.and.returnValue('test-token');

      service.saveFollow(mockFollow).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}follow/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('test-token');
      req.flush({ success: true });
    });

    it('debe lanzar error si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.saveFollow({ user: '1', followed: '2' }).subscribe({
        next: () => fail('No debería llegar al success'),
        error: (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toContain('No token available');
        }
      });
    });

    it('debe capturar error HTTP en saveFollow', () => {
      const mockFollow: Follow = { user: '1', followed: '2' };
      userServiceSpy.getToken.and.returnValue('token');

      service.saveFollow(mockFollow).subscribe({
        next: () => fail('No debería ir al success'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${service['url']}follow/`);
      req.flush('error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('#deleteFollow', () => {
    it('debe realizar DELETE correctamente si hay token', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.deleteFollow('123').subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service['url']}unfollow/`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: '123' });
      req.flush({ success: true });
    });

    it('debe lanzar error si no hay token en deleteFollow', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.deleteFollow('123').subscribe({
        next: () => fail('No debería llegar al success'),
        error: (err) => {
          expect(err.message).toContain('No token available');
        }
      });
    });

    it('debe capturar error HTTP en deleteFollow', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.deleteFollow('123').subscribe({
        next: () => fail('No debería ir al success'),
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${service['url']}unfollow/`);
      req.flush('error', { status: 500, statusText: 'Server Error' });
    });
  });
});
