// models/processingLog.model.ts
export interface ProcessingLog {
  id: string;                     // frontend row key
  status: string;                 // SUCCESS | PENDING | ERROR
  processing_date: string;        // ISO / yyyy-mm-dd

  log_id: string;
  salesorder_id: string;
  customer_name: string;
  file_name: string;
  entity: string;

  customer_po_no: string;
  salesorder_no: string;

  processing_status: string;      // Approved | Pending Approval | JDE-Error | Rejected
  reviewed_by: string;
  reviewed_timestamp: string;     // ISO datetime
}
export interface ProcessingLogRequest {
  start_date: string;
  end_date: string;
}

export interface ProcessingLogResponse {
  page: number;
  page_size: number;
  total_records: number;
  items: any[]; // Replace with proper item type if available
}