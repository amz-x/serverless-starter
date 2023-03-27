// Angular
import { Component, OnInit } from "@angular/core";

// RxJS
// import { Observable } from "rxjs";

// Services
import { APIService } from "@services/api.service";

// Interfaces
import { Task } from "@interfaces";

@Component({
  selector:     'app-tasks-list',
  templateUrl:  './tasks-list.component.html',
  styleUrls:    ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  public $items: Task[] = [];

  constructor (private _apiService: APIService) {}

  public ngOnInit() {
    this.fetchData();
  }

  private async fetchData() {
    const response = await this._apiService.getTasks(); // .get(API_NAME, `/tasks`, {});

    console.log(response);

    if (Array.isArray(response) && response.length > 0) {
      this.$items = [ ...response ];
      return;
    }

    // Fallback
    this.$items = [];
  }
}
