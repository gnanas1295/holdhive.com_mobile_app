/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * No `schema.ts` file found!
 *
 * This generated code has permissive types like `Doc = any` because
 * Convex doesn't know your schema. If you'd like more type safety, see
 * https://docs.convex.dev/database/schemas.
 */
export type DataModel = AnyDataModel;

export type Document<TableName extends string> = any;
export type Doc<TableName extends string> = Document<TableName>;

export type Id<TableName extends string> = GenericId<TableName>;