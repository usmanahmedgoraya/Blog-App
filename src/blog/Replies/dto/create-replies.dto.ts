import { User } from "src/auth/schema/user.schemas";
import { Blog } from "src/blog/schema/blog.schema";
import { Comment } from "src/blog/schema/comment.schema";

export class createRepliesDto {
    readonly blog: Blog;
    readonly content: string;
    readonly user:User;
    readonly comment:Comment
}