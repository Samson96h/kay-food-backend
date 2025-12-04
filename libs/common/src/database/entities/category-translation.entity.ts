import { Column, Entity, ManyToOne } from "typeorm";

import { Category, Language } from "../entities"
import { Base } from "./base";

@Entity()
export class CategoryTranslate extends Base {
    @Column()
    name: string

    @Column()
    description: string

    @ManyToOne(() => Category, { onDelete: 'CASCADE' })
    category: Category;

    @ManyToOne(() => Language, { onDelete: 'CASCADE' })
    language: Language;
}