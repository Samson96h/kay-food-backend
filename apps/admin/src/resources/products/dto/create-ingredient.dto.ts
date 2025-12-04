import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateIngredientDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nameEn:string

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nameRu:string

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    nameAm:string

    @IsNotEmpty()
    @IsNumber()
    price:number
}