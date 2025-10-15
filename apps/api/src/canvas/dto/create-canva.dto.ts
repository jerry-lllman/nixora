import { IsString, IsOptional, IsArray, IsBoolean, IsObject, ValidateNested, IsNumber, Allow } from "class-validator";
import { Type } from "class-transformer";

// 组件实例 DTO（不进行严格验证，因为组件类型是动态的）
export class CanvasComponentDto {
  @IsString()
  instanceId!: string;

  @IsString()
  componentType!: string;

  // 使用 @Allow() 允许 props 内部的任意属性通过验证
  @Allow()
  props!: Record<string, any>;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateCanvasDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CanvasComponentDto)
  components!: CanvasComponentDto[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
