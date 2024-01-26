import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Categories } from './categories.schema';
import { Comment } from './comment.schema';
import { Reaction } from './reaction.schema';

export type BlogDocument = HydratedDocument<Blog>;
export enum Status {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    DISAPPROVE = 'Disapproved',
}

@Schema({
    timestamps: true
})


export class Blog {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: User;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }])
    reaction: Reaction[];

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }])
    comments: Comment[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true })
    categories: Categories

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    image: string;

    @Prop([String])
    tags: string[];

    @Prop({ default: "Pending" })
    status: Status
}

export const BlogSchema = SchemaFactory.createForClass(Blog);