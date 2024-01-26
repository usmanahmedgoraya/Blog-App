import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Replies } from '../schema/Replies.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { createRepliesDto } from './dto/create-replies.dto';
import { updateRepliesDto } from './dto/update-replies.dto';
import { Role, User } from 'src/auth/schema/user.schemas';
import { Comment } from '../schema/comment.schema';

@Injectable()
export class RepliesService {
    constructor(
        @InjectModel(Replies.name) private RepliesModel: Model<Replies>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>
    ) { }

    async findAll(query: Query): Promise<Replies[]> {

        const keyword = query.name ? {
            name: {
                $regex: query.name,
                $options: 'i',
            },
        } : {};

        return await this.RepliesModel.find({ ...keyword }).populate('blog user comment');
    }

    // Create Replies
    // Create Comment
    async createReplies(id: string, createRepliesDto: createRepliesDto, user: User): Promise<Replies> {
        // Get the Blog and check the Blog Id is valid
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new BadRequestException('Please enter correct Comment id')
        }
        const isValidObjectId = mongoose.isValidObjectId(id)
        // Check the id is valid mongoose id
        if (!isValidObjectId) {
            throw new BadRequestException('Object Id is not correct')
        }
        // Merge the data in single object
        const data = Object.assign(createRepliesDto, { user: user._id }, { comment: id });
        // Create comment
        const createReply = await this.RepliesModel.create(data)

        // Pass comment id in blog also
        comment.replies.push(createReply._id)
        comment.save();
        return createReply;
    }

    // Update Replies
    async updateReplies(id: string, updateRepliesDto: updateRepliesDto, user: User): Promise<Replies> {
        const reply = await this.RepliesModel.findById(id)
        if (reply.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        const updatedReplies = await this.RepliesModel.findByIdAndUpdate(id, updateRepliesDto)
        return updatedReplies;

    }

    // Delete Replies
    async deleteReplies(id: string, user: User): Promise<Replies> {
        const isValidObjectId = mongoose.isValidObjectId(id)
        // Check the id is valid mongoose id
        if (!isValidObjectId) {
            throw new BadRequestException('Object Id is not correct')
        }
        // Delete Function Admin Role By Bypassing the comment creator logic
        if (user.role === Role.ISADMIN) {
            const deletedReply = await this.RepliesModel.findByIdAndDelete(id);
            // Delete the Reply in Comment also by admin
            const comment = await this.commentModel.findById(deletedReply.blog)
            comment.replies = comment.replies.filter(id => id !== deletedReply._id.toString());
            await comment.save()
            return deletedReply;
        }

        // Check user is same which create reply
        const Reply = await this.RepliesModel.findById(id)

        if (Reply.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }

        // Deleted the comment in blog also by authorized user
        const deletedReply = await this.RepliesModel.findByIdAndDelete(id)
        // Get the deleted Blog
        const comment = await this.commentModel.findById({ _id: deletedReply.comment.toString() })

        // Update Comments in Blog by filtering the deleted Blog
        comment.replies = comment.replies.filter(commentId => commentId.toString() !== deletedReply._id.toString());
        await comment.save()

        return deletedReply;

    }
}