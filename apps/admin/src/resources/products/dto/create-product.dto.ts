import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    productNameEn: string;

    @IsNotEmpty()
    @IsString()
    productNameRu: string;

    @IsNotEmpty()
    @IsString()
    productNameAm: string;



    @IsNotEmpty()
    @IsString()
    descriptionEn: string;

    @IsNotEmpty()
    @IsString()
    descriptionRu: string;

    @IsNotEmpty()
    @IsString()
    descriptionAm: string;



    @IsNotEmpty()
    @IsNumber()
    weight: number;


    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsNumber()
    categoryId:number
}
