import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base";
import { IngredientTranslate } from "./ingredient-translate.entity";

@Entity('ingredients')
export class Ingredient extends Base {

    @OneToMany(
        () => IngredientTranslate,
        translate => translate.ingredient,
        { cascade: true }
    )
    translations: IngredientTranslate[];

    @Column()
    price: number;
}
