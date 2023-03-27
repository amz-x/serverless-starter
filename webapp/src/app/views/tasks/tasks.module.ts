import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule, TableModule, GridModule, ButtonModule } from '@coreui/angular';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksIndividualComponent } from './tasks-individual/tasks-individual.component';

import { TasksRoutingModule } from './tasks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TasksListComponent,
    TasksIndividualComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    TableModule,
    CardModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TasksModule {}
