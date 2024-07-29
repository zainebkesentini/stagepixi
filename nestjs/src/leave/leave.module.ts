import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Leave, LeaveSchema } from './schemas/leave.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guard/roles.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }]),
  ],
  providers: [LeaveService,  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
  controllers: [LeaveController]
})
export class LeaveModule {}
