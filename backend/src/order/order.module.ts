import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [RepositoryModule],
})
export class OrderModule {}
