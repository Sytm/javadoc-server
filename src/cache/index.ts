import config from "../config";
import { createClient, RedisClient } from "redis";
import { MavenArtifact } from "../maven";
import MavenUtils from "../maven/utils";

export default class Cache {

    private redis: RedisClient;
    
    public constructor() {
        this.redis = createClient(config.redis);
    }

    public setArtifactDownloadURL(this: Cache, artifact: MavenArtifact, downloadURL: string): void {
        const key = MavenUtils.artifactToString(artifact);
        if (artifact.isSnapshot) {
            this.redis.set(key, downloadURL, "EX", config.cache.snapshotExpireAfter);
        } else {
            this.redis.set(key, downloadURL);
        }
    }

    public getArtifactDownloadURL(this: Cache, artifact: MavenArtifact): Promise<string | null> {
        return this.get(MavenUtils.artifactToString(artifact));
    }

    private get(this: Cache, key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.redis.get(key, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
}