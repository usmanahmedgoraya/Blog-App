import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Replies } from './Replies.schema';
import { Blog } from './blog.schema';

export type CommentDocument = Document & Comment;

@Schema({
    timestamps: true
})

export class Comment extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    blog: Blog;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ required: true })
    content: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Replies" }])
    replies: Replies[];
}

const CommentSchema = SchemaFactory.createForClass(Comment);

// CommentSchema.virtual('populatedReplies', {
//     ref: 'Replies',
//     localField: '_id',
//     foreignField: 'comment',
//     justOne: false,
// });

// // CommentSchema.set('toObject', { virtuals: true });
// CommentSchema.set('toJSON', {
//     virtuals: true,
//     transform: (doc, ret) => {
//         ret._id = ret._id;
//         delete ret.id;
//         delete ret.__v;
//     },
// });

export default CommentSchema;
