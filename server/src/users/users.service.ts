import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, IsNull, Repository} from 'typeorm';
import { AccountType, Users } from '../entities/users.entity';
import { Posts } from '../entities/posts.entity';
import { Followers } from '../entities/followers.entity';
import { query } from 'express';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { compare, hash } from 'bcrypt';
import { Notifications } from '../entities/notifications.entity';
import { Settings } from '../entities/settings.entity';
import { NotificationsSettings } from '../entities/notifications_settings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { userSelect } from '../utils/queries';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private dataSource: DataSource, 
    private notificationsGateway: NotificationsGateway,
  ) {}

  create(newUser: CreateUserDto) {
    return this.dataSource.transaction(async manager => {
      try{ 
        const user = await manager.save(Users, newUser);
        console.log("create user -> ", user);
        const settings = new Settings();
        settings.userId = user.id;
        settings.notificationsSettings = new NotificationsSettings(); // This will create a new NotificationsSettings instance

        // Save the Settings entity (NotificationsSettings will be saved automatically due to cascade)
        await manager.save(Settings,settings);
      }catch(err: any) {
        if(err?.code === "ER_DUP_ENTRY"){
          throw new ConflictException(`${err.sqlMessage.split(" ")[2]} already exists`);
        }
        throw new BadRequestException("Something went wrong");
      } 
        return "Created Successfully";
    });
  }

  follow(id: string, currentUser: Users) {
    const userId = currentUser.id;
    if(id === userId){
      throw new BadRequestException('You cannot follow yourself');
    }
    return this.dataSource.transaction(async manager => {
      const user = await manager.findOne(Users, {where: {id}});
      if(!user){
        throw new Error('Users not found'); // Handle user not found scenario
      }
      if(user.account_type === AccountType.PUBLIC){
        this.notificationsGateway.handleFollow(id, userId, `${currentUser.username} started following you`);
        return await manager.save(Followers, {followerId: userId, followingId: id, isAccepted: true});
      }
      this.notificationsGateway.handleSentRequest(id, userId, `${currentUser.username} sent a request to follow you`);
      return await manager.save(Followers, {followerId: userId, followingId: id});
    })
  }


  followRequestAccepted(id: string, user: Users) {
    return this.dataSource.transaction(async manager => {
      const request = await manager.findOne(Followers, {where: {id}});
      if(!request){
        return new BadGatewayException('Request not found'); // Handle request not found scenario
      }
      this.notificationsGateway.handleAcceptRequest(request.followerId, request.followingId, `${user.username} accepted your request to follow you`);
      return await manager.update(Followers, {id}, {isAccepted: true});
    })
  }

  unfollow(id: string) {
    return this.dataSource.transaction(async manager => {
      const request = await manager.findOne(Followers, {where: {id}});
      if(!request){
        return new BadGatewayException('Request not found'); // Handle request not found scenario
      }
      manager.delete(Notifications, {recipientId: request.followingId, actorId: request.followerId});
      return await manager.delete(Followers, {id});
    })
  }

  switchAccountType(user: Users) {
    return this.dataSource.transaction(async manager => {
      if(user.account_type === AccountType.PRIVATE){
        return await manager.update(Users, { id:user.id }, { account_type: AccountType.PUBLIC });
      }
      return await manager.update(Users, { id:user.id }, { account_type: AccountType.PRIVATE });
    })
  }

  async allFollowers(followerId: string, userId: string, search?: string | undefined) {
    const followerRepository = this.dataSource.getRepository(Followers);

    const query = await this.userRepository
      .createQueryBuilder('users')
      .select([
          'users.id as id',
          'users.name as name',
          'users.username as username',
          'users.avatar as avatar',
          `
          CASE 
            WHEN EXISTS (
              SELECT 1
              FROM followers f2
              WHERE f2.followingId = users.id
                AND f2.followerId = :userId
            ) THEN (
              SELECT JSON_OBJECT('id', f2.id, 'isAccepted', f2.isAccepted)
              FROM followers f2
              WHERE f2.followingId = users.id
              AND f2.followerId = :userId
            )
            ELSE null
          END as followStatus
          `
      ])
      .setParameter("userId", userId)
      .leftJoin(Followers, 'followers', 'followers.followerId = users.id')
      .where('followers.isAccepted = true AND followers.followingId = :followerId', { followerId })
    if(search){
      query.andWhere('users.name LIKE :search', { search: `%${search}%` })
        .andWhere('users.email LIKE :search', { search: `%${search}%` })
        .andWhere('users.username LIKE :search', { search: `%${search}%` })
    }
    return query.getRawMany();
  }

  async allFollowing(followingId: string, userId: string, search?: string | undefined) {
    const followerRepository = this.dataSource.getRepository(Followers);
    console.log("followingId -> ", followingId, "userId -> ", userId);
    const query = this.userRepository
        .createQueryBuilder('users')
        .select([
            'users.id as id',
            'users.name as name',
            'users.username as username',
            'users.avatar as avatar',
            `
            CASE 
              WHEN EXISTS (
                SELECT 1
                FROM followers f2
                WHERE f2.followingId = users.id
                  AND f2.followerId = :userId
              ) THEN (
                SELECT JSON_OBJECT('id', f2.id, 'isAccepted', f2.isAccepted)
                FROM followers f2
                WHERE f2.followingId = users.id
                AND f2.followerId = :userId
              )
              ELSE null
              END as followStatus
            `
        ])
        .setParameter("userId", userId)
        .leftJoin(Followers, 'followers', 'followers.followingId = users.id')
        .where('followers.isAccepted = true AND followers.followerId = :followingId', { followingId })
        
      if(search){
        query.andWhere('users.name LIKE :search', { search: `%${search}%` })
          .andWhere('users.email LIKE :search', { search: `%${search}%` })
          .andWhere('users.username LIKE :search', { search: `%${search}%` })
      }
      return query.getRawMany();
  }

  async searchUser(search: string, userId: string) {

    const query = this.userRepository
        .createQueryBuilder('users')
        .select([
          'users.id as id',
          'users.name as name',
          'users.username as username',
          'users.avatar as avatar',
          `
            CASE 
              WHEN EXISTS (
                SELECT 1
                FROM followers f2
                WHERE f2.followingId = users.id
                  AND f2.followerId = :userId
              ) THEN (
                SELECT JSON_OBJECT('id', f2.id, 'isAccepted', f2.isAccepted)
                FROM followers f2
                WHERE f2.followingId = users.id
                AND f2.followerId = :userId
              )
              ELSE null
            END as followStatus
            `
        ])
        .setParameter("userId", userId)
        .where('users.deletedAt IS NULL');

    if(search){
      query.andWhere('users.name LIKE :search', { search: `%${search}%` })
        .andWhere('users.email LIKE :search', { search: `%${search}%` })
        .andWhere('users.username LIKE :search', { search: `%${search}%` })
    }else{
      query.leftJoin("followers", "f", "users.id = f.followingId AND f.followerId = :userId AND f.isAccepted = true")
      .where('f.followingId IS NULL AND users.id != :userId')
      .setParameter("userId", userId)
    }


    return await query.getRawMany();
  }

  async getRequests(userId: string) {
    const query = this.userRepository
        .createQueryBuilder('users')
        .select([
          'users.id as id',
          'users.name as name',
          'users.username as username',
          'users.avatar as avatar',
          'followers.id as requestId',
        ])
        .innerJoin(Followers, 'followers', 'followers.followerId = users.id' + ' AND followers.isAccepted = false')
        .andWhere('users.deletedAt IS NULL')
    return await query.getRawMany();
  }

  findAll(): Promise<Users[]> {
    return this.dataSource.transaction(async manager => {
      return manager.find(Users);
    })
  }

  findOne(id: string, userId: string) {
    return this.userRepository
        .createQueryBuilder('users')
        .select([
          ...userSelect,
          `
            CASE 
              WHEN EXISTS (
                SELECT 1
                FROM followers f2
                WHERE f2.followingId = :id
                  AND f2.followerId = :userId
              ) THEN (
                SELECT JSON_OBJECT('id', f2.id, 'isAccepted', f2.isAccepted)
                FROM followers f2
                WHERE f2.followingId = :id
                AND f2.followerId = :userId
              )
              ELSE null
            END as followStatus
          `,
          `
            CASE 
              WHEN EXISTS (
                SELECT 1
                FROM followers f2
                WHERE f2.followingId = :userId
                  AND f2.followerId = :id
              ) THEN (
                SELECT JSON_OBJECT('id', f2.id, 'isAccepted', f2.isAccepted)
                FROM followers f2
                WHERE f2.followingId = :userId
                AND f2.followerId = :id
              )
              ELSE null
            END as isFollowing
          `
        ])
        .innerJoin(Settings, 's', 's.userId = users.id')
        .innerJoin(NotificationsSettings, 'ns', 'ns.id = s.notificationsSettingsId')
        .where('users.deletedAt IS NULL')
        .where('users.id = :id', { id })
        .setParameters({id, userId})
        .getRawOne();
  }

  findByname(name: string) {
    return this.dataSource.transaction(async manager => {
      return manager.findOne(Users, {where: {name}});
    });
  }

  findByEmail(email: string) {
    return this.dataSource.transaction(async manager => {
      return manager.findOne(Users, {where: {email}});
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.dataSource.transaction(async manager => {
      try{
        const user = manager.findOne(Users, {where: {id}});
        if(!user){
          throw new NotFoundException("user not found");
        }

        return manager.update(Users, id, data)
      }catch(err: any) {
        if(err?.code === "ER_DUP_ENTRY"){
          throw new ConflictException(`${err.sqlMessage.split(" ")[2]} already exists`);
        }
        throw new BadRequestException("Something went wrong");
      }
    })
  }

  changePassword(data: UpdatePasswordDto, id: string) {
    return this.dataSource.transaction(async manager => {
      const user = await manager.findOne(Users, {where: {id}});
      if(!user){
        throw new BadRequestException('User Not Found');
      }
      if( !await compare(data.password, user.password)){
        throw new UnauthorizedException('Incorrect Password');
      }
      const password = await hash(data.new_password, 10);
      return manager.update(Users, id, {password})
    })
  }

  async remove(id: string) {
  return this.dataSource.transaction(async manager => {
    const user = await manager.findOne(Users, {where: {id}});
    if (!user) {
      throw new Error('Users not found'); // Handle user not found scenario
    }
      const date = new Date()
      await manager.update(Users, id, {deletedAt: date})
      await manager.update(Posts, {creator: id, deletedAt: IsNull()}, {deletedAt: date })
    })
  }

  restore(id: string) {
    return this.dataSource.transaction(async manager => {
      const user = await manager.findOne(Users, {where: {id}, withDeleted: true});
      if(!user){
        return "user not found";
      }
      await manager.update(Users, id, {deletedAt: null})
      await manager.update(Posts, {creator: id, deletedAt: user.deletedAt}, { deletedAt: null })
    })
  }

  delete(id: string){
    return this.dataSource.transaction(async manager => {
      const user = await manager.findOne(Users, {where: {id}});
      if (!user) {
        return 'Users not found'; // Handle Post not found scenario
      }

      await manager.delete(Users, id)
    })
  }
}
