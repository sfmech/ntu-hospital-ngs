import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { CustomJwtService } from "./jwt.service";
import { JwtConfig } from "./config/jwt.config";
import { NGSBuilderDbModule } from "src/database/ngs-builder/ngs-builder-db.module";
import { JwtController } from "./jwt.controller";

@Module({
  imports: [
    ConfigModule.forFeature(JwtConfig),
    NGSBuilderDbModule,
    NestJwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [JwtController],
  providers: [CustomJwtService, JwtStrategy],
  exports: [CustomJwtService]
})
export class JwtModule { }
