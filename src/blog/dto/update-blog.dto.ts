import { User } from "src/auth/schema/user.schemas";
import { Status } from "../schema/blog.schema";
import { Reaction } from "../schema/reaction.schema";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class updateBlogDto {

    readonly user: User

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    readonly image: string;

    @IsArray()
    @IsNotEmpty()
    readonly tags: string[]

    readonly status: Status

    readonly reaction: Reaction[]

    readonly comments: Comment[]
}