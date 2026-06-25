import type { PipelineContext } from "./pipeline";
import type { Match } from "../types";

export interface Rule {
  /**
   * شناسه یکتا
   */
  readonly id: string;

  /**
   * نام Rule
   */
  readonly name: string;

  /**
   * دسته‌بندی
   */
  readonly category: string;

  /**
   * شدت
   */
  readonly severity: "low" | "medium" | "high";

  /**
   * اجرای Rule
   */
  match(context: PipelineContext): Match[];
}
