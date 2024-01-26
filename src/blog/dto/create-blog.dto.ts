import { IsString } from "class-validator";
import { User } from "src/auth/schema/user.schemas";
import { Status } from "../schema/blog.schema";
import { Comment } from "../schema/comment.schema";
import { Reaction } from "../schema/reaction.schema";


export class createBlogDto {


    readonly user: User

    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    readonly image: string;

    readonly tags: string[]

    readonly status: Status

    readonly reaction: Reaction[]

    readonly comments: Comment[]

}