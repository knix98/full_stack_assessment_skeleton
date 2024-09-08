import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';

@Entity('home')
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  street_address: string;

  @Column({ length: 50, nullable: true })
  state: string;

  @Column({ length: 10, nullable: true })
  zip: string;

  @Column({ type: 'float', unsigned: true, nullable: true })
  sqft: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  beds: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  baths: number;

  @Column({ type: 'float', unsigned: true, nullable: true })
  list_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Version for Optimistic Locking
  @VersionColumn()
  version: number;
}