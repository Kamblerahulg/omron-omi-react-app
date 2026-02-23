// models/processingLogDetail.model.ts
export interface ProcessingLogDetail {
  Company: string;
  "Sold To": string;
  "Ship To": string;
  Currency: string;
  "Customer PO": string;
  "Processed Date": string;
  confidence_scores: {
    overall_confidence: string;
  };
  items: Array<Record<string, string>>;
}
