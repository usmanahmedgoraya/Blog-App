import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { createBlogDto } from './dto/create-blog.dto';
import { updateBlogDto } from './dto/update-blog.dto';
import { Blog, Status } from './schema/blog.schema';
import { React, Reaction } from './schema/reaction.schema';
import toStream = require('buffer-to-stream');

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
        @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    ) { }

    // Get all the Blogs
    async findAll(): Promise<Blog[]> {
        return await this.blogModel.find().populate('categories user comments').populate({
            path: 'reaction',
            populate: {
                path: 'user',
                model: 'User',
            },
        })
    }

    // Get all the Blogs
    async findAllUserBlog(user: User): Promise<Blog[]> {
        return await this.blogModel.find({ user: user._id })
    }

    // Get Blog By Id
    async findOne(id: string): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }
        const blog = await this.blogModel.findById(id)
        return blog

    }

    // Create Blog
    async createBlog(createBlogDto: createBlogDto, user: User, imageUrl: any): Promise<Blog> {
        const data = Object.assign(createBlogDto, { user: user._id, image: imageUrl.data });
        const blog = await this.blogModel.create(data)
        return blog;
    }

    // Update Blog
    async updateBlog(id: string, updateBlogDto: updateBlogDto, user: User): Promise<Blog> {
        const blog = await this.blogModel.findById(id)
        if (blog.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        const updatedBlog = await this.blogModel.findByIdAndUpdate(id, { ...updateBlogDto, status: "pending" })

        return updatedBlog;
    }

    // Delete Blog
    async deleteBlog(id: string, user: User): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }
        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Not Found')
        }
        if (user.role === "admin") {
            return await this.blogModel.findByIdAndDelete(id)
        }

        if (blog.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        return await this.blogModel.findByIdAndDelete(id)
    }


    // Approved Blog By Admin
    async approvedBlog(id: string): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }

        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Blog Not Found')
        }

        if (blog.status === "Approved") {
            throw new ConflictException('Blog already approved')
        }
        blog.status = Status.APPROVED
        blog.save()
        return blog;
    }

    // DisApproved Blog By Admin
    async disapprovedBlog(id: string): Promise<Blog> {

        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }

        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Blog Not Found')
        }
        if (blog.status === "Disapproved") {
            throw new ConflictException('Blog already disapproved')
        }
        blog.status = Status.DISAPPROVE
        blog.save()
        return blog;
    }

    // User Reaction on Blog
    async userBlogReaction(id: string, reactionType: React, user: User): Promise<Reaction> {
        // console.log(user._id,reactionType);

        const reaction = await this.reactionModel.find({ blog: id, user: user._id })
        console.log(reaction);

        if (reaction.length === 0) {
            const newReaction = await this.reactionModel.create({
                blog: id,
                user: user._id,
                reactionType: reactionType
            })
            const blog = await this.blogModel.findById(id)
            blog.reaction.push(newReaction._id)
            await blog.save()
            return newReaction
        };
        if (reaction[0].reactionType === reactionType) {
            const deletedReaction = await this.reactionModel.findByIdAndDelete(reaction[0]._id);
            const blog = await this.blogModel.findById(id)
            blog.reaction = blog.reaction.filter(id => id !== deletedReaction._id.toString());
            await blog.save()
            return deletedReaction

        }
        const updateReaction = await this.reactionModel.findByIdAndUpdate(reaction[0]._id, { reactionType: reactionType })

        return updateReaction;
    }

    // Upload image
    async uploadImage(
        fileName: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        return new Promise((resolve, reject) => {
            v2.config({
                cloud_name: 'dyunqrxki',
                api_key: '314779842884433',
                api_secret: '-i0YvyvBHBBli53Z5jMliLGbf3A',
            });
            console.log('Hello 2');

            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                console.log(result)
                resolve(result);
            });
            toStream(fileName.buffer).pipe(upload);
        });
    }
}
