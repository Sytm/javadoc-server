import { ClientOpts } from "redis";

export interface JavadocServerConfig {
    redis: ClientOpts;
    cache: {
        snapshotExpireAfter: number;
    }
}

const config: JavadocServerConfig = require("../../data/config.json");

export default config;
