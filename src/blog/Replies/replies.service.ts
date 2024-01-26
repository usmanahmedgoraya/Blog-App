import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Replies } from '../schema/Replies.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { createRepliesDto } from './dto/create-replies.dto';
import { updateRepliesDto } from './dto/update-replies.dto';
import { User } from 'src/auth/schema/user.schemas';

@Injectable()
export class RepliesService {
    constructor(@InjectModel(Replies.name) private RepliesModel: Model<Replies>) { }

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
    async createReplies(createRepliesDto: createRepliesDto, user: User): Promise<Replies> {
        const data = Object.assign(createRepliesDto, { user: user._id });
        const createReplies = await this.RepliesModel.create(data)
        return createReplies;
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
        const reply = await this.RepliesModel.findById(id)
        if (reply.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        return await this.RepliesModel.findByIdAndDelete(id)
    }
}