import { join } from "path";
import { mkdtempSync } from "fs-extra";

export default class PathUtils {
    private static readonly root: string = join(__dirname, "..", "..");
    public static readonly config: string = join(PathUtils.root, "data", "config.json");
    public static readonly extractionFolder: string = join(PathUtils.root, "data", "extracted");
    public static readonly tempFolder: string = mkdtempSync("javadoc-server");
}