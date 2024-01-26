import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Blog } from './blog.schema';

export type ReactionDocument = HydratedDocument<Reaction>;
export enum React {
    LIKE = "like",
    FUNNY = "funny",
    SAD = "sad",
    LOVE = "love",
    DISLIKE = 'dislike'
}
@Schema({
    timestamps: true
})

export class Reaction extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    blog: Blog

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User

    @Prop({ required: true })
    reactionType: React
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);