import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SachDienTu } from './sach-dien-tu';

describe('SachDienTu', () => {
  let component: SachDienTu;
  let fixture: ComponentFixture<SachDienTu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SachDienTu],
    }).compileComponents();

    fixture = TestBed.createComponent(SachDienTu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
