import { Body, Controller, Get, Post ,HttpCode, HttpStatus, Param,UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { get } from 'http';
import { Public } from 'src/decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { User } from './schemas/user.schema';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Public()  // Marquer cette route comme publique
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login') // Utilisation de POST pour la connexion
  @HttpCode(HttpStatus.OK)
  @Public()  // Marquer cette route comme publique
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

   // Optionnel : Si vous souhaitez gérer la déconnexion via le serveur
   @Post('/logout')
   @HttpCode(HttpStatus.OK)
   @Public()  // Marquer cette route comme publique si la déconnexion est gérée côté client
   logout(@Req() req): { message: string } {
     // La déconnexion est gérée côté client en supprimant le token du stockage
     return { message: 'Logout successful' };
   }
 

 


  @UseGuards(AuthGuard('jwt'))
  @Get(':id/leaveBalance')
  async getLeaveBalance(@Param('id') id: string): Promise<number> {
    return this.authService.getLeaveBalance(id);
  }

 


  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req): Promise<User> {
    return this.authService.getProfile(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/profile')
  getProfileById(@Param('id') id: string): Promise<User> {
    return this.authService.getProfile(id);
  }
}