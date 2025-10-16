import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/user.entity";
import { CanvasComponent } from "../interfaces/canvas-component.interface";

@Entity({ name: "canvas" })
export class Canvas {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "jsonb" })
  components!: CanvasComponent[];

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ nullable: true })
  publishUrl?: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
