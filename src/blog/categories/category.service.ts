import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import mongoose, { Model } from 'mongoose';
import { Categories } from '../schema/categories.schema';
import { createCategoryDto } from './dto/create-category.dto';
import { updateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    // Use Constructor for getting the neccesay things
    constructor(
        @InjectModel(Categories.name) private categoryModel: Model<Categories>
    ) { }

    // Find Categories
    async findAll(query: Query): Promise<Categories[]> {

        // Remove the case sensitivity for better query search results
        const keyword = query.name ? {
            name: {
                $regex: query.name,
                $options: 'i',
            },
        } : {};

        // find the category or categories
        return await this.categoryModel.find({ ...keyword }).populate('blog');
    }

    // Create Category
    async createBlog(createCategoryDto: createCategoryDto): Promise<Categories> {
        // Destructure the name from body Object
        const { name } = createCategoryDto;

        // Make it lower case letters
        const lowerName = name.toLocaleLowerCase();

        // Find the category if it already exist it won't allow to re-create
        const category = await this.categoryModel.findOne({ name: lowerName })
        if (category) {
            throw new ConflictException('Category Already Exist')
        }

        // Create the new category
        const createCategory = await this.categoryModel.create({ name: lowerName })
        return createCategory;
    }

    // Update Category
    async updateCategory(id: string, updateCategoryDto: updateCategoryDto): Promise<Categories> {
        try {

            // Destructure the name from body Object
            const { name } = updateCategoryDto;

            // Make it lower case letters
            const lowerName = name.toLocaleLowerCase();
            // Check the Valid mongoose Id
            const isIdValid = mongoose.isValidObjectId(id)
            if (!isIdValid) {
                throw new BadRequestException('Incorrect Object ID')
            }

            // Check category fom this id is exist or not
            const category = await this.categoryModel.findById(id)
            if (!category) {
                throw new NotFoundException('Category Not Found')
            }

            // Simply Update the category :)
            const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, { name: lowerName })
            return updatedCategory;
        } catch (error) {
            return error.message
        }

    }

    // Delete Category
    async deleteCategory(id: string): Promise<Categories> {
        // Check the Valid mongoose Id
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }

        // Check category fom this id is exist or not
        const category = await this.categoryModel.findById(id)

        if (!category) {
            throw new NotFoundException('Category Not Found')
        }
        // And simply delete the catefory :)
        return await this.categoryModel.findByIdAndDelete(id)
    }
}