import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      username: 'root',
      password: 'root',
      database: 'nest',
      entities: [
        'dist/entites/**/*.entity.js'
      ],
      migrations: [
        "dist/migration/**/*.js"
      ],
      /** ↓本番環境では使用しない(https://docs.nestjs.com/techniques/database) */
      synchronize: true,
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
