import { Blog } from "src/blog/schema/blog.schema";

export class updateCategoryDto {
    readonly blog: Blog
    readonly name: string
}