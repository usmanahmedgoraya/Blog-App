import { Blog } from "src/blog/schema/blog.schema";

export class updateReactionDto {
    readonly blog: Blog
    readonly name: string
}