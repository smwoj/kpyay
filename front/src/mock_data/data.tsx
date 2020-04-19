import { SLOTHS_PASTRY_POINTS } from "./sloths_pastry_classifiers";
import { DOGS_MUFFINS_POINTS } from "./dogs_muffins_classifiers";
import { Point } from "../models/Point";

export const SLOTHS_VS_PASTRY_FSCORES: Point[] = SLOTHS_PASTRY_POINTS.map((r) =>
  Point.fromRaw(r)
);
export const DOGS_VS_MUFFINS_FSCORES: Point[] = DOGS_MUFFINS_POINTS.map((r) =>
  Point.fromRaw(r)
);
