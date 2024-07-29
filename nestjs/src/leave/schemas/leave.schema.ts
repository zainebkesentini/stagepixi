import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Leave {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop()
  duration: number;

  @Prop()
  reason: string;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);

LeaveSchema.pre('save', function (next) {
  const leave = this as any;
  if (leave.startDate && leave.endDate) {
    const durationInMilliseconds = new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime();
    leave.duration = durationInMilliseconds / (1000 * 60 * 60 * 24) + 1; // Inclut le jour de début dans la durée
  }
  next();
});
