import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Follower {
  @PrimaryColumn()
  followerId: string;
  @PrimaryColumn()
  followingId: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
  img: null;
  createAt: Date;
  updateAt: Date;
}
