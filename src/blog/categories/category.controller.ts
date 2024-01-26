import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/schema/user.schemas';
import { Categories } from '../schema/categories.schema';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dto/create-category.dto';
import { updateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryservice: CategoryService) { }

    // Get All Categories
    // Everyone access it
    @Get()
    async findAllCategory(@Query() query: ExpressQuery): Promise<Categories[]> {
        return await this.categoryservice.findAll(query);
    }

    // Create new category 
    // Only admin have access to this endpoint

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async createCategory(@Body() createCategoryDto: createCategoryDto): Promise<Categories> {
        return await this.categoryservice.createBlog(createCategoryDto)
    }

    // Update the category
    // Only admin have access to this endpoint

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async update(@Param('id') id: string, @Body() updateCategoryDto: updateCategoryDto) {
        const blog = await this.categoryservice.updateCategory(id, updateCategoryDto);
        return blog
    }


    // Delete the Category 
    // Only admin have access to this endpoint
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async DeleteBlog(@Param('id') id: string) {
        return await this.categoryservice.deleteCategory(id);
    }
}
