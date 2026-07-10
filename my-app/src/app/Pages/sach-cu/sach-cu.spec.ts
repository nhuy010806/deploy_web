import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SachCu } from './sach-cu';

describe('SachCu', () => {
  let component: SachCu;
  let fixture: ComponentFixture<SachCu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SachCu],
    }).compileComponents();

    fixture = TestBed.createComponent(SachCu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
