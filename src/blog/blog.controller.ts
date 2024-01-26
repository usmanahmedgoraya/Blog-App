import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/schema/user.schemas';
import { BlogService } from './blog.service';
import { createBlogDto } from './dto/create-blog.dto';
import { blogReactionDto } from './dto/reactionBlogDto.dto';
import { updateBlogDto } from './dto/update-blog.dto';
import { Reaction } from './schema/reaction.schema';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) { }

    @Get()
    async findAll() {
        return await this.blogService.findAll();
    }

    @Get("user-blogs")
    @UseGuards(JwtAuthGuard)
    async findUserBlog(@Req() req) {
        return await this.blogService.findAllUserBlog(req.user);
    }

    @Get(":id")
    async findById(
        @Param('id')
        id: string,

    ) {
        return await this.blogService.findOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISWRITER)
    async create(@Body() createBlogDto: createBlogDto, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const imageUrl = await this.blogService
            .uploadImage(file)
            .then((data) => {
                return {
                    statusCode: 200,
                    data: data.secure_url,
                };
            })
            .catch((err) => {
                return {
                    statusCode: 400,
                    message: err.message,
                };
            });


        return await this.blogService.createBlog(createBlogDto, req.user, imageUrl);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISWRITER)
    async update(@Param('id') id: string, @Body() updateBlogDto: updateBlogDto, @Req() req) {
        const blog = await this.blogService.updateBlog(id, updateBlogDto, req.user);
        return blog
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN, Role.ISWRITER)
    async DeleteBlog(@Param('id') id: string, @Req() req) {
        // console.log(Role.ISADMIN);
        return await this.blogService.deleteBlog(id, req.user);
    }

    @Put('approved/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async ApprovedBlog(@Param('id') id: string) {
        // console.log(Role.ISADMIN);
        return await this.blogService.approvedBlog(id);
    }


    @Put('disapproved/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async disApprovedBlog(@Param('id') id: string) {
        // console.log(Role.ISADMIN);
        return await this.blogService.disapprovedBlog(id);
    }

    // reaction on Blog

    @Post('reaction/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async userReactionBlog(@Param('id') id: string, @Body() reaction: blogReactionDto, @Req() req: any): Promise<Reaction> {
        const { type } = reaction
        const blog = await this.blogService.userBlogReaction(id, type, req.user);
        return blog
    }

    // Upload image
    @Post('online')
    @UseInterceptors(FileInterceptor('file'))
    async online(@UploadedFile() file: Express.Multer.File) {
        return await this.blogService
            .uploadImage(file)
            .then((data) => {
                return {
                    statusCode: 200,
                    data: data
                };
            })
            .catch((err) => {
                return {
                    statusCode: 400,
                    message: err.message,
                };
            });
    }



}
