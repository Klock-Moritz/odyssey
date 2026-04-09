import type { HalResource } from "../utils/hal";
import type { JSONResponse } from "./json-response";

export type WithHalData = {
  data: HalResource,
}

export type HalJSONResponse = JSONResponse & WithHalData;