import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ContentAttachmentService } from "./contentattachment.service";
import { ContentAttachment } from "../../models/contentattachment/contentattachment.entity";
import { ContentAttachmentController } from "../../controllers/contentattachment/contentattachment.controller";

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([ContentAttachment])],
  providers: [ContentAttachmentService],
  controllers: [ContentAttachmentController],
  exports: [ContentAttachmentService],
})
export class ContentAttachmentModule {}