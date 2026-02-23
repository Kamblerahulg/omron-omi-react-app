import axios from "axios";
import { ProcessingLog, ProcessingLogRequest, ProcessingLogResponse } from "../models/processingLog.model";
import { MOCK_PROCESSING_LOGS } from "../mocks/processingLog.mock";
import { MOCK_PROCESSING_LOG_DETAILS } from "../mocks/processingLogDetail.mock";
import { callApi } from "../api/api.util";

/* ============================= */
/* 🔹 MAIN SERVICE OBJECT */
/* ============================= */
export const processingLogService = {
  list: async (startDate?: string, endDate?: string): Promise<any[]> => {
    try {
      const response = await callApi<{
        page: number;
        page_size: number;
        total_records: number;
        items: any[];
      }>({
        url: "invoices/processing-log",
        method: "POST",
        requiresAuth: true,
        data: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      if (!response?.items || !Array.isArray(response.items)) {
        return [];
      }

      return response.items.map((item: any) => ({
        id: item.id,

        // ✅ Normalized fields for Dashboard
        processedDate: item.created_date,
        supplierName: item.supplier_name,
        bu: item.bu,
        invoiceOrderNo: item.invoice_number,
        invoiceDate: item.invoice_date,
        reconciliationStatus: item.recon_status,

        // 🔥 Fix backend typo safely
        status:
          item.status === "Pendign Approval"
            ? "Pending Approval"
            : item.status,

        reviewedBy: item.reviewed_by,
        reviewedDate: item.reviewed_date,
        file_path: item.file_path,
        fileName: item.file_name,
        invoiceType: item.invoice_type,
        confidenceScore: item.confidence_score,
      }));
    } catch (error) {
      console.error("API failed", error);
      return [];
    }
  },
  updateStatus: async (
    ids: number[],
    status: string,
    approver_comment: string
  ) => {
    const response = await fetch(
      "https://vmog6qwktg.execute-api.ap-southeast-1.amazonaws.com/stage/invoices/processing-log",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids,
          status,
          approver_comment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update processing logs");
    }

    return response.json();
  },
};

