import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Blog } from './blog.schema';
import { Comment } from './comment.schema';

export type RepliesDocument = HydratedDocument<Replies>;

@Schema({
    timestamps: true
})

export class Replies extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    blog: Blog;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Comment" })
    comment: Comment;

    @Prop({ required: true })
    content: string
}

export const RepliesSchema = SchemaFactory.createForClass(Replies);