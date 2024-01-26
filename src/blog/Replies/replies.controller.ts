import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Replies } from '../schema/Replies.schema';
import { RepliesService } from './replies.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { createRepliesDto } from './dto/create-replies.dto';
import { updateRepliesDto } from './dto/update-replies.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('replies')
export class RepliesController {
    constructor(private repliesService: RepliesService) { }

    // =================
    // Get All Replies
    // =================
    @Get()
    async findAllReplies(@Query() query: ExpressQuery): Promise<Replies[]> {
        return await this.repliesService.findAll(query);
    }

    // ==============
    // Create Replies
    // ==============
    @Post(":id")
    @UseGuards(new JwtAuthGuard())
    async createReplies(@Param('id') id: string, @Body() createRepliesDto: createRepliesDto, @Req() req: any): Promise<Replies> {
        return await this.repliesService.createReplies(id, createRepliesDto, req.user)
    }

    // ================
    // Update replies
    // ================
    @Patch(':id')
    @UseGuards(new JwtAuthGuard())
    async update(@Param('id') id: string, @Body() updateRepliesDto: updateRepliesDto, @Req() req) {
        const Replies = await this.repliesService.updateReplies(id, updateRepliesDto, req.user);
        return Replies
    }

    // ===============
    // Delete Reply
    // ===============
    @Delete(':id')
    @UseGuards(new JwtAuthGuard())
    async DeleteReplies(@Param('id') id: string, @Req() req) {
        return await this.repliesService.deleteReplies(id, req.user);
    }
}
