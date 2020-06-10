import { join } from "path";
import PathUtil from "./path";
import * as unzipper from "unzipper";
import axios from "axios";

export default class DownloadUtils {
  public static async extractDocfile(
    url: string,
    localPath: string
  ): Promise<void> {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });
    response.data.pipe(
      unzipper.Extract({
        path: join(PathUtil.extractionFolder, localPath),
      })
    );
    await new Promise((resolve, reject) => {
      response.data.on("error", reject);
      response.data.on("end", resolve);
    });
  }
  public static async getString(url: string): Promise<string> {
    const response = await axios({
      method: "GET",
      url,
      responseType: "text",
    });
    if (response.status !== 200) {
      throw new Error(
        `Unaccptable status code (${response.status} - ${response.statusText})`
      );
    }
    return response.data;
  }
}
