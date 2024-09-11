import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralaComponent } from './generala.component';

describe('GeneralaComponent', () => {
  let component: GeneralaComponent;
  let fixture: ComponentFixture<GeneralaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
