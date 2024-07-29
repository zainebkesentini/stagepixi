import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;
  
    console.log('Signing up user with email:', email);
  
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
  
    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      console.log('User created successfully:', user);
  
      const token = this.jwtService.sign({ id: user._id, role: user.role });
      console.log('JWT token generated:', token);
  
      return { token };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id , role: user.role });

    return { token };
  }

  // Méthode pour obtenir le solde de congé
  async getLeaveBalance(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.leaveBalance;
  }

  // Méthode pour mettre à jour le solde de congé
  async updateLeaveBalance(userId: string, leaveBalance: number): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { leaveBalance },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  // Méthode pour obtenir le profil de l'utilisateur
  async getProfileById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

    // Optionnel : Méthode pour gérer la déconnexion (si nécessaire)
    async logout(): Promise<{ message: string }> {
      // Pour des raisons de sécurité, le serveur ne gère généralement pas la déconnexion
      // mais vous pouvez ajouter une logique ici si nécessaire
      return { message: 'Logout successful' };
    }
}