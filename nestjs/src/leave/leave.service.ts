import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { Leave } from './schemas/leave.schema';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leave.name)
    private leaveModel: mongoose.Model<Leave>,
    private userService: AuthService, // Injecter UserService
  ) {}

  async findAll(query: Query): Promise<Leave[]> {
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
  
    const leaves = await this.leaveModel.find({ ...keyword });
    return leaves;
  }
  

  

  //async create(leave: Leave, user: User): Promise<Leave> {
   // const data = Object.assign(leave, { user: user._id, status: 'Pending' });

    //const res = await this.leaveModel.create(data);
    //return res;
  //}

  async create(leave: Leave, user: User): Promise<Leave> {
    // Déduire le solde de congé de l'utilisateur, même si cela le rend négatif
    const newLeaveBalance = user.leaveBalance - leave.duration;
    await this.userService.updateLeaveBalance(user._id.toString(), newLeaveBalance);

    // Informer l'utilisateur si le solde devient négatif
    if (newLeaveBalance < 0) {
      // Vous pouvez loguer cette information ou l'envoyer par notification
      console.warn(`User ${user._id} has a negative leave balance.`);
    }

    const data = Object.assign(leave, { user: user._id, status: 'Pending' });
    const res = await this.leaveModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Leave> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const leave = await this.leaveModel.findById(id).populate('user');

    if (!leave) {
      throw new NotFoundException('Leave not found.');
    }

    return leave;
  }

  async findByUser(user: User): Promise<Leave[]> {
    return await this.leaveModel.find({ user: user._id });
  }
  

  async updateById(id: string, leave: UpdateLeaveDto): Promise<Leave> {
    const updatedLeave = await this.leaveModel.findByIdAndUpdate(
      id,
      leave,
      { new: true, runValidators: true },
    );

    if (!updatedLeave) {
      throw new NotFoundException('Leave not found.');
    }

    return updatedLeave;
  }

  async deleteById(id: string): Promise<Leave> {
    return await this.leaveModel.findByIdAndDelete(id);
  }

 
  async getGlobalCalendar(query: Query): Promise<Leave[]> {
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Ajout du filtre pour le statut "Approved"
    const statusFilter = { status: 'Approved' };


    const leaves = await this.leaveModel
      .find({ ...keyword, ...statusFilter }); // Ajout du filtre de statut
    
    return leaves;
}

  
  
  

  async approveLeave(id: string): Promise<Leave> {
    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true, runValidators: true },
    );

    if (!leave) {
      throw new NotFoundException('Leave not found.');
    }

    return leave;
  }

    async findApprovedLeaves(): Promise<Leave[]> {
    return this.leaveModel.find({ status: 'Approved' }).exec();
  }


  
}
