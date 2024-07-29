import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: string; role: string[] }) {
    const { id, role } = payload;
    console.log('Validating JWT token with payload:', payload);
  
    const user = await this.userModel.findById(id);
  
    if (!user) {
      console.error('User not found, denying access');
      throw new UnauthorizedException('Login first to access this endpoint.');
    }
  
    console.log('User found, returning user data:', user);
    return { ...user.toObject(), role };
  }
}