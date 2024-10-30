import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  import { Users } from '../../entities/users.entity';
  import { hash } from 'bcrypt'
  
  @EventSubscriber()
  export class UsersSubscriber implements EntitySubscriberInterface<Users> {
    constructor(dataSource: DataSource) {
      dataSource.subscribers.push(this);
    }
  
    listenTo() {
      return Users;
    }
  
    async beforeInsert(event: InsertEvent<Users>) {
      event.entity.password = await hash(event.entity.password, 10)
    }
  }