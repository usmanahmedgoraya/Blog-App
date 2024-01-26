import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Reaction } from '../schema/Reaction.schema';
import { ReactionService } from './reaction.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { createReactionDto } from './dto/create-reaction.dto';
import { updateReactionDto } from './dto/update-reaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/schema/user.schemas';
import { BlogService } from '../blog.service';
import { blogReactionDto } from '../dto/reactionBlogDto.dto';

@Controller('reactions')
export class ReactionController {
    constructor(private Reactionservice: ReactionService,private blogService:BlogService) { }

    // Find Reactions
    @Get()
    async findAllReaction(@Query() query: ExpressQuery): Promise<Reaction[]> {
        return await this.Reactionservice.findAll(query);
    }


    // create and update and Delete reaction on Blog
    @Post(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async userReactionBlog(@Param('id') id: string,@Body() reaction:blogReactionDto, @Req() req:any):Promise<Reaction> {
        const {type} = reaction
        const blog = await this.blogService.userBlogReaction(id,type,req.user);
        return blog
    }
}
