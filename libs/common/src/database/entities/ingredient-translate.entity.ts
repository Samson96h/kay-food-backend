import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./base";
import { Ingredient } from "./ingredients-entity";
import { Language } from "./languages-entity";

@Entity('ingredient_translations')
export class IngredientTranslate extends Base {
    @Column()
    name: string;

    @ManyToOne(
        () => Ingredient,
        ingredient => ingredient.translations,
        { onDelete: 'CASCADE' }
    )
    ingredient: Ingredient;
    
    @ManyToOne(() => Language, { onDelete: 'CASCADE' })
    language: Language;
}
