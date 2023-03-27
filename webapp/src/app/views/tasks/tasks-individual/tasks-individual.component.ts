// Angular
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router, UrlSegment } from "@angular/router";

// RxJS
import { map, Observable, switchMap } from "rxjs";

// Services
import { APIService } from "@services/api.service";

// Interfaces
import { Task, TaskStatus } from "@interfaces";
import { FormControl, FormGroup, Validators } from "@angular/forms";


@Component({
  selector:     'app-tasks-individual',
  templateUrl:  './tasks-individual.component.html',
  styleUrls:    ['./tasks-individual.component.scss']
})
export class TasksIndividualComponent implements OnInit {

  public $id: Observable<string | null> = this._route.paramMap.pipe(
    map((params: ParamMap) => params.get('id'))
  );

  public $action: Observable<UrlSegment[]> = this._route.url.pipe();

  public $task: Observable<Task | null> = this._route.paramMap.pipe(
    switchMap((params: ParamMap) => this._apiService.getTask(params.get('id')))
  );

  public id         = '';
  public action     = '';
  public task: Task = { title: '', description: '', status: 'OPEN' as TaskStatus } as Task;

  public taskForm   = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    status: new FormControl<TaskStatus>('OPEN', Validators.required)
  });

  constructor (private _router: Router, private _route: ActivatedRoute, private _apiService: APIService) {

    // Task ID
    this.$id.subscribe((id: string | null) => (this.id = (id !== null ? id : '')));

    // Task
    this.$task.subscribe((task: Task | null) => (this.updateTaskViewAndForm(task)));

    // Action
    this.$action.subscribe((urlSegments: UrlSegment[]) => (this.action = this.getTaskAction(urlSegments)));
  }

  public ngOnInit(): void {
    // this.taskForm = new FormGroup({});
  }

  /**
   * Task Action from URL
   *
   * - New Task
   * - View Task
   * - Edit Task
   */
  private getTaskAction(urlSegments: UrlSegment[]): string {

    const urlPaths: string[] = [];
    for (const urlSegment of urlSegments) {
      if (urlSegment.path) {
        urlPaths.push(urlSegment.path);
      }
    }

    const urlPath = urlPaths.join('');

    // NEW TASK
    if (urlPath.indexOf('new') !== -1) {
      return 'New';
    }

    // VIEW TASK
    if (urlPath.indexOf('view') !== -1) {
      return 'View';
    }

    // EDIT TASK
    if (urlPath.indexOf('edit') !== -1) {
      return 'Edit';
    }

    // Should not get here
    return '';
  }

  private updateTaskViewAndForm(task: Task | null) {
    if (task === null) {
      return;
    }

    // Task View
    this.task = task;

    // Task Form
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status
    });
  }

  public async onFormSubmit() {
    if (this.taskForm.valid) {
      const formControls = this.taskForm.controls;

      const task = {
        title:       formControls.title.getRawValue(),
        description: formControls.description.getRawValue(),
        status:      formControls.status.getRawValue()
      };

      console.log(task);

      if (this.action === 'New') {
        const response = await this._apiService.createTask(task);

        if (typeof response.id === 'string' && response.id.length > 0) {
          this._router.navigate(['tasks', 'view', response.id]);
          return;
        }
      }

      if (this.action === 'Edit') {
        const response = await this._apiService.updateTask(this.id, task);

        if (typeof response.id === 'string' && response.id.length > 0 && this.id === response.id) {
          this._router.navigate(['tasks', 'view', response.id]);
          return;
        }
      }
    }
  }

  public async deleteTask() {
    if (this.id !== '') {
      const response = await this._apiService.deleteTask(this.id);
      console.log(response);

      this._router.navigate(['tasks', 'list']);
    }
  }
}

