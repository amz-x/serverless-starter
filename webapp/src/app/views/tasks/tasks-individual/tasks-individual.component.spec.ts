import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TasksIndividualComponent } from './tasks-individual.component';

describe('TaskListComponent', () => {
  let component: TasksIndividualComponent;
  let fixture: ComponentFixture<TasksIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksIndividualComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
