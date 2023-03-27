// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Tasks Components
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksIndividualComponent } from './tasks-individual/tasks-individual.component';

// import { TasksListingComponent } from './buttons/buttons.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tasks'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TasksListComponent,
        data: {
          title: 'Listing'
        }
      },
      {
        path: 'new',
        component: TasksIndividualComponent,
        data: {
          title: 'New'
        }
      },
      {
        path: 'view/:id',
        component: TasksIndividualComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: TasksIndividualComponent,
        data: {
          title: 'Edit'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
