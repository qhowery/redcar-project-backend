import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // Add this import

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Add PassportModule
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy // Add JWT strategy provider
  ],
  controllers: [AuthController],
  exports: [PassportModule], // Export PassportModule
})
export class AuthModule {}