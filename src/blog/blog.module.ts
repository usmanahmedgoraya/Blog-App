import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RepliesController } from './Replies/replies.controller';
import { RepliesService } from './Replies/replies.service';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CategoryController } from './categories/category.controller';
import { CategoryService } from './categories/category.service';
import { commentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { RepliesSchema } from './schema/Replies.schema';
import { BlogSchema } from './schema/blog.schema';
import { CategoriesSchema } from './schema/categories.schema';
import CommentSchema from './schema/comment.schema';
import { ReactionSchema } from './schema/reaction.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: "Blog", schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: "Reaction", schema: ReactionSchema }]),
    MongooseModule.forFeature([{ name: "Categories", schema: CategoriesSchema }]),
    MongooseModule.forFeature([{ name: "Replies", schema: RepliesSchema }])
  ],
  controllers: [BlogController, CategoryController, ReactionController, commentController, RepliesController],
  providers: [BlogService, CategoryService, ReactionService, CommentService, RepliesService]
})
export class BlogModule { }
