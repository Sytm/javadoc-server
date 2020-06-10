import MavenUtils from "./utils";

export interface MavenArtifact {
  groupId: string;
  artifactId: string;
  version: string;
  isSnapshot: boolean;
  classifier?: string;
}

export interface MavenMetadata {
  $: {
    modelVersion: string;
  };
  groupId: string[];
  artifactId: string[];
  version: string[];
  versioning: [
    {
      snapshot: [
        {
          timestamp: string[];
          buildNumber: string[];
        }
      ];
      lastUpdated: string[];
      snapshotVersions: [
        {
          snapshotVersion: [
            {
              extension: string[];
              value: string[];
              updated: string[];
              classifier?: string[];
            }
          ];
        }
      ];
    }
  ];
}

//https://hub.spigotmc.org/nexus/service/local/repositories/snapshots/content/org/spigotmc/spigot-api/1.15.2-R0.1-SNAPSHOT/maven-metadata.xml
export class MavenRepository {
  public constructor(private url: string) {}

  public getDownloadURL(artifact: MavenArtifact) {
    MavenUtils.isSnapshot("");
  }
}
