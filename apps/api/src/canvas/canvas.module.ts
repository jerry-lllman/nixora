import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasService } from './canvas.service';
import { CanvasController } from './canvas.controller';
import { Canvas } from './entities/canva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Canvas])],
  controllers: [CanvasController],
  providers: [CanvasService],
  exports: [CanvasService]
})
export class CanvasModule {}
