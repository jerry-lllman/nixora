import { IsString, IsOptional, IsArray, IsBoolean } from "class-validator";

export class CreateCanvasDto {
  @IsString()
  title!: string;

  @IsArray()
  components!: any[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
