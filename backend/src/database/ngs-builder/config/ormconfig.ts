import { Run } from "../entities/run.entity";
import path = require("path");
import { Sample } from "../entities/sample.entity";
import { Segment } from "../entities/segment.entity";
import { SegmentTag } from "../entities/segmentTag.entity";
import { Setting } from "../entities/setting.entity";
import { Disease } from "../entities/disease.entity";
import { MutationQC } from "../entities/mutationQC.entity";
import { Coverage } from "../entities/coverage.entity";
require('dotenv').config();

const isTsNode = process[Symbol.for('ts-node.register.instance')]
const BuilderDbConfig = {
    type: 'postgres',
    host: process.env.BUILDER_DB_HOST,
    port: +process.env.BUILDER_DB_PORT,
    username: process.env.BUILDER_DB_USERNAME,
    password: process.env.BUILDER_DB_PASSWORD,
    database: process.env.BUILDER_DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [Run, Sample, Segment, SegmentTag, Setting, Disease, MutationQC, Coverage],
    migrations: [
        `dist/database/ngs-builder/migrations/*.js`,
    ],
    cli: {
        migrationsDir: "src/database/ngs-builder/migrations"
    }
};

module.exports = BuilderDbConfig;
