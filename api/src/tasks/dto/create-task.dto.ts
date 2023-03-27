// Swagger
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  description: string;
}
