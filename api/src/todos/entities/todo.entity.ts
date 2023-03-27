// TypeORM
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', update: false})
  createdAt: Date | null;

  @Column({ type: 'timestamp', update: true })
  updatedAt: Date | null;

  @Column({ type: 'timestamp', default: null })
  completedAt: Date | null;  
}
