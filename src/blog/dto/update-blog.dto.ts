import { User } from "src/auth/schema/user.schemas";
import { Status } from "../schema/blog.schema";
import { Reaction } from "../schema/reaction.schema";

export class updateBlogDto {
    readonly user: User
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly tags: string[]
    readonly status: Status
    readonly reaction: Reaction[]

    readonly comments: Comment[]
}