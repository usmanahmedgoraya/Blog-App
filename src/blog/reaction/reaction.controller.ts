import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/schema/user.schemas';
import { BlogService } from '../blog.service';
import { blogReactionDto } from '../dto/reactionBlogDto.dto';
import { Reaction } from '../schema/Reaction.schema';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
    constructor(private Reactionservice: ReactionService, private blogService: BlogService) { }

    // Find Reactions
    @Get()
    async findAllReaction(@Query() query: ExpressQuery): Promise<Reaction[]> {
        return await this.Reactionservice.findAll(query);
    }


    // create and update and Delete reaction on Blog
    @Post(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async userReactionBlog(@Param('id') id: string, @Body() reaction: blogReactionDto, @Req() req: any): Promise<Reaction> {
        const { type } = reaction
        const blog = await this.blogService.userBlogReaction(id, type, req.user);
        return blog
    }
}
