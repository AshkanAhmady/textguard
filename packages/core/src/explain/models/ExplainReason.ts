export type ExplainReasonCode = "rule-match";

export interface ExplainReason {
  readonly code: ExplainReasonCode;
  readonly message: string;
}
