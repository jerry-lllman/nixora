import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canva.dto';
import { UpdateCanvasDto } from './dto/update-canva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request-with-user.type';

@Controller('canvas')
@UseGuards(JwtAuthGuard)
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createCanvasDto: CreateCanvasDto) {
    return this.canvasService.create(req.user.id, createCanvasDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.canvasService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.canvasService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCanvasDto: UpdateCanvasDto
  ) {
    return this.canvasService.update(id, req.user.id, updateCanvasDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.canvasService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  publish(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.canvasService.publish(id, req.user.id);
  }

  @Post(':id/unpublish')
  unpublish(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.canvasService.unpublish(id, req.user.id);
  }
}
