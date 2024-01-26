import { IsEnum, IsNotEmpty } from "class-validator";
import { Blog } from "src/blog/schema/blog.schema";
import { React } from "src/blog/schema/reaction.schema";

export class createReactionDto {
    readonly blog: Blog

    @IsNotEmpty()
    @IsEnum(React)
    readonly reactionType: React
}