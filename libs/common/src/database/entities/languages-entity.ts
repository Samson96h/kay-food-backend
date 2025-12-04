import { Languages } from "../enums/languages-enum";
import { Column, Entity } from "typeorm"
import { Base } from "./base";

@Entity('languages')
export class Language extends Base {
    @Column({
        type: 'enum',
        enum: Languages,
        default: Languages.ENGLISH
    })
    name: Languages;
}
