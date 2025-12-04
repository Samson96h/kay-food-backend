import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { MediaFiles } from "./index";
import { Base } from "./base";
import { CategoryTranslate } from "./category-translation.entity";


@Entity('categories')
export class Category extends Base {
    @OneToMany(() => CategoryTranslate, tr => tr.category, { cascade: true })
    translations: CategoryTranslate[];

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category | null;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @ManyToMany(() => MediaFiles)
    @JoinTable({
        name: 'category_media_files',
        joinColumn: { name: 'category_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'media_file_id', referencedColumnName: 'id' },
    })
    mediaFiles: MediaFiles[]
}