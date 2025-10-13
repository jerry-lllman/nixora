import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { User } from "./user.entity";

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export type SafeUser = Omit<User, "password">;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const entity = this.usersRepository.create(data);

    try {
      return await this.usersRepository.save(entity);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === "23505"
      ) {
        throw new ConflictException("Email address already in use.");
      }

      throw error;
    }
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  toSafeUser(user: User): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
