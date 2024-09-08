import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true, nullable: false })
  username: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;
}