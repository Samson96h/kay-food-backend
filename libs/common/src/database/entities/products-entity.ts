import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { ProductTranslate } from "./product-translation.entity";
import { User, Category, MediaFiles } from "./index";
import { Base } from "./base";

@Entity('products')
export class Product extends Base {

    @OneToMany(() => ProductTranslate, tr => tr.product, { cascade: true })
    translations: ProductTranslate[];

    @Column()
    weight: number;

    @Column()
    price: number;

    @ManyToOne(() => Category, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    categoryId: Category;

    @ManyToMany(() => MediaFiles, { cascade: true })
    @JoinTable({
        name: 'products_media_files',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'media_file_id', referencedColumnName: 'id' },
    })
    mediaFiles: MediaFiles[];

    @ManyToMany(() => User, (user) => user.favorites)
    likedBy: User[];
}
