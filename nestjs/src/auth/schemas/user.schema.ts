import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Role } from "src/enums/role.enum";

@Schema({
    timestamps:true
})
export class User extends Document{
    @Prop()
    name: string ;

    @Prop({unique: [true , 'Duplicated Email Entered']})
    email:string ;

    @Prop()
    password:string;

    @Prop({ type: [String], enum: Role, default: [Role.employee] })  // default role is 'employee'
    role: Role[];

    @Prop({ default: 10 })
    leaveBalance: number; // Ajouter cette ligne
}
export const UserSchema = SchemaFactory.createForClass(User);
