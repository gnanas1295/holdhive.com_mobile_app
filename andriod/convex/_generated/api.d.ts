/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as bookings from "../bookings.js";
import type * as favorites from "../favorites.js";
import type * as files from "../files.js";
import type * as init from "../init.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as reviews from "../reviews.js";
import type * as search from "../search.js";
import type * as seed from "../seed.js";
import type * as spaces from "../spaces.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  bookings: typeof bookings;
  favorites: typeof favorites;
  files: typeof files;
  init: typeof init;
  messages: typeof messages;
  notifications: typeof notifications;
  reviews: typeof reviews;
  search: typeof search;
  seed: typeof seed;
  spaces: typeof spaces;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;