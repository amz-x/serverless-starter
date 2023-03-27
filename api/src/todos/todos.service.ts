import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {

  constructor(@InjectRepository(Todo) private todosRepository: Repository<Todo>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {

    const todo        = new Todo();
    todo.title        = createTodoDto.title;
    todo.description  = createTodoDto.description;
    todo.createdAt    = new Date(new Date().toUTCString());
    todo.updatedAt    = todo.createdAt;
    return await this.todosRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todosRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    return await this.todosRepository.findOneBy({ id });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo        = await this.findOne(id);
    todo.title        = updateTodoDto.title;
    todo.description  = updateTodoDto.description;
    todo.completedAt  = null;
    todo.updatedAt    = new Date(new Date().toUTCString());

    return await this.todosRepository.save(todo);
  }

  async remove(id: string) : Promise<void> {
    await this.todosRepository.delete(id);
  }
}
