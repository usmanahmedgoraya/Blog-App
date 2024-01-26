import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogSchema } from './schema/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { AuthModule } from 'src/auth/auth.module';
import CommentSchema from './schema/comment.schema';
import { ReactionSchema } from './schema/reaction.schema';
import { CategoriesSchema } from './schema/categories.schema';
import { CategoryController } from './categories/category.controller';
import { CategoryService } from './categories/category.service';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { commentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { RepliesService } from './Replies/replies.service';
import { RepliesController } from './Replies/replies.controller';
import { RepliesSchema } from './schema/Replies.schema';

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
