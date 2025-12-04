import { IsNotEmpty, IsOptional, IsNumber, IsString } from "class-validator";

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @IsNotEmpty()
  @IsString()
  nameRu: string;

  @IsNotEmpty()
  @IsString()
  nameAm: string;



  @IsNotEmpty()
  @IsString()
  descriptionEn: string;

  @IsNotEmpty()
  @IsString()
  descriptionRu: string;

  @IsNotEmpty()
  @IsString()
  descriptionAm: string;


  
  @IsOptional()
  @IsNumber()
  parentId?: number;
}