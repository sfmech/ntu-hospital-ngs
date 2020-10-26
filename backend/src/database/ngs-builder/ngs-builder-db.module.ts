import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuilderDbConfigFactory } from './config/course-builder-db.config';
import { Run } from './entities/run.entity';
import { Sample } from './entities/sample.entity';
import { Segment } from './entities/segment.entity';
import { SegmentTag } from './entities/segmentTag.entity';

@Module({
    imports: [
        ConfigModule.forFeature(BuilderDbConfigFactory),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory:
                async (configService: ConfigService) => {
                    const connection = configService.get('builderDb');

                    return {
                        ...connection
                    };
                },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Run, Sample, Segment, SegmentTag]),
    ],
    providers: [],
    exports: [TypeOrmModule]
})
export class NGSBuilderDbModule { }
