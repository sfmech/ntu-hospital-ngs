import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseLogger } from 'src/logger/utils/database.logger';
import { BuilderDbConfigFactory } from './config/course-builder-db.config';
import { Aligned } from './entities/aligned.entity';
import { Coverage } from './entities/coverage.entity';
import { Disease } from './entities/disease.entity';
import { HealthCareWorkers } from './entities/healthCareWorkers.entity';
import { MutationQC } from './entities/mutationQC.entity';
import { Panel } from './entities/panel.entity';
import { Run } from './entities/run.entity';
import { Sample } from './entities/sample.entity';
import { Segment } from './entities/segment.entity';
import { SegmentTag } from './entities/segmentTag.entity';
import { Setting } from './entities/setting.entity';
import { User } from './entities/user.entity';

@Module({
    imports: [
        ConfigModule.forFeature(BuilderDbConfigFactory),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, LoggerModule],
            useFactory:
                async (configService: ConfigService, loggerService: LoggerService) => {
                    const connection = configService.get('builderDb');

                    return {
                        ...connection,
                        logging: ['error', 'warn'],
                        logger: new DatabaseLogger(loggerService),
                    };
                },
            inject: [ConfigService, LoggerService],
        }),
        TypeOrmModule.forFeature([Run, Sample, Segment, SegmentTag, Setting, Disease, MutationQC, Coverage, User, Aligned, HealthCareWorkers, Panel]),
    ],
    providers: [],
    exports: [TypeOrmModule]
})
export class NGSBuilderDbModule { }
