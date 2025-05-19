import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeModalComponent } from './like-modal.component';

describe('LikeModalComponent', () => {
  let component: LikeModalComponent;
  let fixture: ComponentFixture<LikeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LikeModalComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe emitir el evento close si el clic no es en la overlay', () => {
    spyOn(component.close, 'emit');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const otherElement = document.createElement('div');
    otherElement.classList.add('some-other-class');
    document.body.appendChild(otherElement);

    document.dispatchEvent(event);

    expect(component.close.emit).not.toHaveBeenCalled();

    document.body.removeChild(otherElement);
  });

  it('debe emitir el evento close cuando se llama a onClose', () => {
    spyOn(component.close, 'emit');

    component.onClose();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
