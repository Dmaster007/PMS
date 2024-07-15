import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssuesComponent } from './create-issues.component';

describe('CreateIssuesComponent', () => {
  let component: CreateIssuesComponent;
  let fixture: ComponentFixture<CreateIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIssuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
