import { registerAs } from "@nestjs/config";
import * as BuilderDbConfig from "./ormconfig";

export const BuilderDbConfigFactory = registerAs('builderDb', () => (BuilderDbConfig));

