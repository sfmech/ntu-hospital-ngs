import { registerAs } from '@nestjs/config';

export const NgsConfig = registerAs('ngs', () => ({
    path:process.env.DATA_ROOT_PATH
}));
