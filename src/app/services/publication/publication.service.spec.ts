import { TestBed } from '@angular/core/testing';
import { PublicationService } from './publication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../user/user.service';

describe('PublicationService', () => {
  let service: PublicationService;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PublicationService,
        { provide: UserService, useValue: spy }
      ]
    });

    service = TestBed.inject(PublicationService);
    httpMock = TestBed.inject(HttpTestingController);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('#getFollowedPublications', () => {
    it('debe hacer GET con token válido', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getFollowedPublications().subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(service['url'] + 'followed-publications');
      expect(req.request.headers.get('Authorization')).toBe('token');
      req.flush({ data: [] });
    });

    it('debe lanzar error si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.getFollowedPublications().subscribe({
        next: () => fail('No debería llegar al success'),
        error: err => expect(err.message).toContain('No token available')
      });
    });

    it('debe manejar error HTTP', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.getFollowedPublications().subscribe({
        next: () => fail('No debe llegar'),
        error: err => expect(err.status).toBe(500)
      });

      const req = httpMock.expectOne(service['url'] + 'followed-publications');
      req.flush('error', { status: 500, statusText: 'Error Server' });
    });
  });

  describe('#savePublication', () => {
    it('debe hacer POST si hay token', () => {
      userServiceSpy.getToken.and.returnValue('token');
      const pub = { title: 'Prueba', description: 'desc' };

      service.savePublication(pub).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(service['url'] + 'save-publication/');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });

    it('debe fallar si no hay token', () => {
      userServiceSpy.getToken.and.returnValue(null);

      service.savePublication({ title: 'X' }).subscribe({
        next: () => fail(),
        error: err => expect(err.message).toContain('No token available')
      });
    });
  });

  describe('#deletePublication', () => {
    it('debe hacer DELETE si hay token', () => {
      userServiceSpy.getToken.and.returnValue('token');

      service.deletePublication('123').subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(service['url'] + 'delete-publication/123');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });

  describe('#uploadImagePublication', () => {
    it('debe subir imagen con FormData y token', () => {
      userServiceSpy.getToken.and.returnValue('token');

      const fakeFile = new File(['img'], 'test.jpg', { type: 'image/jpeg' });

      service.uploadImagePublication('abc123', fakeFile).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(service['url'] + 'upload-image-pub/abc123');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush({ image: 'test.jpg' });
    });
  });

  describe('#getCounters', () => {
    it('debe incluir Bearer token en el header', () => {
      userServiceSpy.getToken.and.returnValue('my-token');

      service.getCounters().subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(service['url'] + 'counters');
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
      req.flush({ counters: {} });
    });
  });
});
