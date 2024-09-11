import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterpartComponent } from './footerpart.component';

describe('FooterpartComponent', () => {
  let component: FooterpartComponent;
  let fixture: ComponentFixture<FooterpartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterpartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
