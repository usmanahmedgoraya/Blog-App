import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Blog } from '../schema/blog.schema';
import { React, Reaction } from '../schema/reaction.schema';

@Injectable()
export class ReactionService {
    constructor(@InjectModel(Reaction.name) private ReactionModel: Model<Reaction>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>) { }


    // Find Reactions
    async findAll(query: Query): Promise<Reaction[]> {

        const keyword = query.name ? {
            name: {
                $regex: query.name,
                $options: 'i',
            },
        } : {};

        return await this.ReactionModel.find({ ...keyword }).populate('blog user');
    }

    // User Reaction on Blog
    async userBlogReaction(id: string, reactionType: React, user: User): Promise<Reaction> {
        // console.log(user._id, reactionType);

        const reaction = await this.ReactionModel.find({ blog: id, user: user._id })
        console.log(reaction);

        if (reaction.length === 0) {
            const newReaction = await this.ReactionModel.create({

                blog: id,
                user: user._id,
                reactionType: reactionType
            })
            const blog = await this.blogModel.findById(id)
            blog.reaction.push(newReaction._id)
            await blog.save()
            console.log('reaction created successfully');
            return newReaction
        };
        if (reaction[0].reactionType === reactionType) {
            const deletedReaction = await this.ReactionModel.findByIdAndDelete(reaction[0]._id);
            const blog = await this.blogModel.findById(id)
            blog.reaction = blog.reaction.filter(id => id !== deletedReaction._id.toString());
            await blog.save()
            console.log('reaction deleted successfully');

            return deletedReaction

        }
        const updateReaction = await this.ReactionModel.findByIdAndUpdate(reaction[0]._id, { reactionType: reactionType })
        console.log('reaction updated successfully');

        return updateReaction;
    }


}