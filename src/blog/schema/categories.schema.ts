import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Blog } from './blog.schema';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema({
    timestamps: true
})

export class Categories {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    blog: Blog

    @Prop({ required: true })
    name: string;

}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);