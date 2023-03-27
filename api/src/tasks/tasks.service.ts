import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(Task) private tasksRepository: Repository<Task>) {}

  /**
   * Find All Task in DB
   * 
   * Note: Filtering can be applied
   */
  async findAllTasks(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  /**
   * Find Task by ID in DB
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const found = await this.tasksRepository.findOneBy({ id });

      if (!found) {
        throw new NotFoundException(`Task with ID [${id}] not found`);
      }

      return found;
    } catch (ex) {
      console.warn(ex);
      return null;
    }
  }

  /**
   * Create Task in DB
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task        = new Task();
    task.title        = createTaskDto.title;
    task.description  = createTaskDto.description;
    task.status       = TaskStatus.OPEN;

    return await this.tasksRepository.save(task);
  }

  /**
   * Update Task in DB
   */
  async updateTask (id: string, updateTaskDto: UpdateTaskDto) {
    const task        = await this.getTaskById(id);
    task.title        = updateTaskDto.title;
    task.description  = updateTaskDto.description;
    task.status       = updateTaskDto.status;

    return await this.tasksRepository.save(task);
  }

  /**
   * Delete Task in DB
   */
  async deleteTask(id: string) : Promise<DeleteResult | null> {
    try {
      return await this.tasksRepository.delete(id);
    } catch (ex) {
      console.warn(ex);
      return null;
    }
  }
}
