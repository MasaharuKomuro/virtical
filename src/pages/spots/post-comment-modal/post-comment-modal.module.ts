import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostCommentModalPage } from './post-comment-modal';

@NgModule({
  declarations: [
    PostCommentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PostCommentModalPage),
  ],
})
export class PostCommentModalPageModule {}
