import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktFilterComponent } from './produkt-filter.component';

describe('ProduktFilterComponent', () => {
  let component: ProduktFilterComponent;
  let fixture: ComponentFixture<ProduktFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduktFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduktFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
