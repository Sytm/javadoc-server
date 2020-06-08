"use strict";

import path from "path";

export default class PathUtils {
    private static readonly root: string = path.join(__dirname, "..", "..");
    public static readonly config: string = path.join(PathUtils.root, "data", "config.json");
    public static readonly extractionFolder: string = path.join(PathUtils.root, "data", "extracted");
    public static readonly tempFolder: string = "";
}