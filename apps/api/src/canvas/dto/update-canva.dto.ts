import { PartialType } from '@nestjs/mapped-types';
import { CreateCanvasDto } from './create-canva.dto';

export class UpdateCanvasDto extends PartialType(CreateCanvasDto) {}
