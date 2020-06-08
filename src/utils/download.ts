"use strict";

import * as fse from "fs-extra";
import axios from "axios";

export default class DownloadUtils {
  public static downloadFile(url: string): Promise<string> {
      
  }
  public static async getString(url: string): Promise<string> {
    try {
      let result = await axios({
        method: "GET",
        url,
        responseType: "text",
      });
      if (result.status !== 200) {
          throw new Error(`Unaccptable status code (${result.status} - ${result.statusText})`);
      }
      return result.data;
    } catch (e) {
        throw e;
    }
  }
}
