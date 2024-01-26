import { Blog } from "src/blog/schema/blog.schema";

export class createCategoryDto {
    readonly blog: Blog
    readonly name: string
}