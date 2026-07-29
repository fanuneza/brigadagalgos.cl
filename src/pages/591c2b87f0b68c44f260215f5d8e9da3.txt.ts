import { createIndexNowKeyRoute } from "@jdevalk/astro-seo-graph";
import { INDEXNOW_KEY } from "../config/site";

export const GET = createIndexNowKeyRoute({
  key: INDEXNOW_KEY,
});
