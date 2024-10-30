import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Notifications } from '../../entities/notifications.entity';  // Path to your Notification entity
import { Posts } from '../../entities/posts.entity';  // Path to your Post entity
import { DataSource } from 'typeorm';

@EventSubscriber()
export class NotificationsSubscriber implements EntitySubscriberInterface<Notifications> {
  
  constructor(private dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Notifications;
  }

  async beforeInsert(event: InsertEvent<Notifications>) {
    const postId = event.entity.postId;

    if (postId) {

      console.log("postId at subscriber-> ", postId);
      // Fetch the post to get the userId
      const postRepository = event.manager.getRepository(Posts);
      const post = await postRepository.findOne({ where: { id: postId } });
      console.log("post -> ", post);
      if (post) {
        // Set the userId of the post as the recipientId
        event.entity.recipientId = post.creatorId;
      }
    }
  }
}
