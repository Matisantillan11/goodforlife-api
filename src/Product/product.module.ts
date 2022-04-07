import { Module } from '@nestjs/common';
import { ConnectionProvider } from 'src/Application/database/connectionProvider.service';
import { Config } from 'src/config';
import { ProductService } from './Domain/services/product/product.service';

@Module({
  imports: [ConnectionProvider],
  controllers: Config.controllers.product,
  providers: Config.services.product,
  exports: [ProductService],
})
export class ProductModule {}
