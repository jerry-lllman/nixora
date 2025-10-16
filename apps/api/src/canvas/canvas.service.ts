import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateCanvasDto } from './dto/create-canva.dto';
import { UpdateCanvasDto } from './dto/update-canva.dto';
import { Canvas } from './entities/canva.entity';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(Canvas)
    private readonly canvasRepository: Repository<Canvas>,
    private readonly configService: ConfigService
  ) {}

  async create(userId: string, createCanvasDto: CreateCanvasDto): Promise<Canvas> {
    const canvas = this.canvasRepository.create({
      ...createCanvasDto,
      userId
    });
    return await this.canvasRepository.save(canvas);
  }

  async findAll(userId: string): Promise<Canvas[]> {
    return await this.canvasRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Canvas> {
    const canvas = await this.canvasRepository.findOne({
      where: { id, userId }
    });

    if (!canvas) {
      throw new NotFoundException(`Canvas with ID ${id} not found`);
    }

    return canvas;
  }

  async update(id: string, userId: string, updateCanvasDto: UpdateCanvasDto): Promise<Canvas> {
    const canvas = await this.findOne(id, userId);

    Object.assign(canvas, updateCanvasDto);
    return await this.canvasRepository.save(canvas);
  }

  async remove(id: string, userId: string): Promise<void> {
    const canvas = await this.findOne(id, userId);
    await this.canvasRepository.remove(canvas);
  }

  async publish(id: string, userId: string): Promise<Canvas> {
    const canvas = await this.findOne(id, userId);
    
    const nxAppUrl = this.configService.get<string>('app.nxAppUrl');
    
    canvas.isPublished = true;
    canvas.publishedAt = new Date();
    canvas.publishUrl = `${nxAppUrl}/p/${id}`;
    
    return await this.canvasRepository.save(canvas);
  }

  async unpublish(id: string, userId: string): Promise<Canvas> {
    const canvas = await this.findOne(id, userId);
    canvas.isPublished = false;
    return await this.canvasRepository.save(canvas);
  }
}
