import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionProvider } from './connectionProvider.service';

@Global()
@Module({
  providers: [
    ConnectionProvider,
    /* {
      provide: 'MONGO',
      useFactory: async () => {
        const uri = process.env.CLUSTER + '/' + process.env.DB_NAME + '?retryWrites=true&w=majority';
        const client = new MongoClient(uri);

        await client.connect();
        console.log(`connected to: ${process.env.DB_NAME}`);
        const database = client.db(process.env.DB_NAME);
         const taskCollection = database.collection('tasks') 
        const tasks = await taskCollection.find().toArray() 

        return database;
      },
    }, */
  ],
  exports: [/* 'MONGO', */ ConnectionProvider],
})
export class DatabaseModule {}
