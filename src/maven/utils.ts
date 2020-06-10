import { MavenArtifact } from ".";

export default class MavenUtils {
    public static isSnapshot(version: string): boolean {
        return version.toUpperCase().endsWith("-SNAPSHOT");
    }
    public static artifactToString({ groupId, artifactId, version, classifier }: MavenArtifact) {
        return `${groupId}:${artifactId}:${version}${classifier === undefined ? "" : `:${classifier}`}`;
    }
}
