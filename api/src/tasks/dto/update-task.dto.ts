// Swagger
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Tasks
import { TaskStatus }    from '../task-status.enum';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @ApiProperty({ required: true, type: 'enum', enum: TaskStatus })
  status: TaskStatus;
}
