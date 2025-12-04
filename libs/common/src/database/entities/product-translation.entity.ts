import { Column, Entity, ManyToOne } from "typeorm";
import { Language } from "./languages-entity";
import { Product } from "./products-entity";
import { Base } from "./base";

@Entity('product_translations')
export class ProductTranslate extends Base {
    
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => Language, { onDelete: 'CASCADE' })
    language: Language;
}
