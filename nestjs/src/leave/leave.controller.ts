import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { LeaveService } from './leave.service';
import { Leave } from './schemas/leave.schema';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import mongoose from 'mongoose';

@Controller('leave')
export class LeaveController {
  constructor(private leaveService: LeaveService) {}
  //afficher tous les conges 
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.rh)
  @Get('')
  async getAllLeaves(@Query() query: ExpressQuery): Promise<Leave[]> {
    return this.leaveService.findAll(query);
  }
//calendrier
  @UseGuards(AuthGuard('jwt'))
  @Get('calendar')
  async getGlobalCalendar(@Query() query: ExpressQuery): Promise<Leave[]> {
    return this.leaveService.getGlobalCalendar(query);
  }  



//ajouter un congé
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.employee)
  @Post()
  async createLeave(
    @Body() leave: CreateLeaveDto,
    @Req() req,
  ): Promise<Leave> {
    return this.leaveService.create(leave, req.user);
  }
//
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.employee)
  @Get('me')
  async getMyLeaves(@Req() req): Promise<Leave[]> {
    return this.leaveService.findByUser(req.user);
  }

  @Get(':id')
  async getLeave(
    @Param('id')
    id: string,
  ): Promise<Leave> {
    return this.leaveService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.rh)
  @Put(':id/approve')
  async approveLeave(
    @Param('id')
    id: string,
  ): Promise<Leave> {
    return this.leaveService.approveLeave(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.employee)
  @Put(':id')
  async updateLeave(
    @Param('id')
    id: string,
    @Body() leave: UpdateLeaveDto,
  ): Promise<Leave> {
    return this.leaveService.updateById(id, leave);
  }
  
  @Delete(':id')
  async deleteLeave(
    @Param('id')
    id: string,
  ): Promise<Leave> {
    return this.leaveService.deleteById(id);
  }
}
