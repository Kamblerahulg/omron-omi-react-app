import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack, ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ReconciliationTable from "../components/ReconciliationTable";
import { rejectFile } from "../api/omiApi";
import { getPdfUrlOriginal, getPdfUrlMasked } from "../api/omiApi";
import PdfViewer from "../components/PdfViewer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { processingLogService } from "../services/processingLog.service";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface InvoiceItem {
  Invoice_Number?: string;
  Invoice_ItemCode?: string | null;
  Invoice_ItemName?: string | null;
  Invoice_ItemQty?: string | null;
  Invoice_ItemQtyUnitOfMeasurement?: string | null;
  Invoice_ItemUnitPrice?: string | null;
  Invoice_ItemCurrencyCode?: string | null;
  Invoice_ItemTotalPrice?: string | null;
}

interface InvoiceDoc {
  document_type: "invoice";
  InvoiceVendor_Name?: string;
  Invoice_Number?: string;
  Invoice_DeliveryNoteNumber?: string;
  Invoice_Date?: string;
  Invoice_TotalPrice?: string;
  Invoice_TotalQuantity?: string | null;
  Invoice_Date_Matched?: "Y" | "N";
  Invoice_TotalPrice_Matched?: "Y" | "N";
  items?: InvoiceItem[];
}

interface DeliveryItem {
  DO_ItemCode?: string | null;
  DO_ItemName?: string | null;
  DO_ItemQty?: string | null;
  DO_ItemUnitMeasurement?: string | null;
  DO_Item_PO_Number?: string | null;
}

interface DeliveryDoc {
  document_type: "delivery_notes";
  DO_Vendor_Name?: string | null;
  DO_CustomDocumentDate?: string | null;
  DO_CustomDocumentType?: string | null;
  DO_CustomDocumentNumber?: string | null;
  DO_DeliveryNoteNumber?: string | null;
  DO_DeliveryDate?: string | null;
  DO_TotalQuantity?: string | null;
  DO_InvoiceNumber?: string | null;
  DO_DeliveryDate_Matched?: "Y" | "N";
  items?: DeliveryItem[];
}

type RowType = {
  invoiceNumber: string;
  date: string;
  itemName: string;
  unitPrice: number;
  totalAmount: number;
};

type StatusType =
  | "Pending Approval"
  | "Approved"
  | "JDE-Success"
  | "JDE-Error"
  | "Rejected";


const ammicInvoiceItems = [
  { a_itemNo: "AM-01", a_itemName: "AMMIC Item Name 1", a_invoiceitemqty: 43, a_invoiceitemtotalprice: 62400 },
  { a_itemNo: "AM-02", a_itemName: "AMMIC Item Name 3", a_invoiceitemqty: 56, a_invoiceitemtotalprice: 36000 },
];
const normalizedAmmicInvoiceItems = ammicInvoiceItems.map(item => ({
  itemNo: item.a_itemNo,
  itemName: item.a_itemName,
  qty: item.a_invoiceitemqty,
  amount: item.a_invoiceitemtotalprice,
}));
const dialogPrimaryBtn = {
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 11,
  height: 28,
  px: 2,
  backgroundColor: "#005EB8",
  "&:hover": { opacity: 0.9 },
};

const dialogCancelBtn = {
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 11,
  height: 28,
  px: 2,
};

// const ammicInvoiceSummary = {
//   supplierName: "Automation Center Singapore POC Lab",
//   a_invoiceDate: "25-Jun-2026",
//   a_invoicetotalprice: "$ 98,400",
//   a_invoicetotalqty: 99,
//   a_invoicedeliverynoteno: "DN-AM-4455",
//   a_invoiceReff: "AMMIC-REF-8899",
// };

// const ammicDeliveryItems = [
//   {
//     itemCode: "DIAM-41",
//     itemName: "Steel Bolt 16mm",
//     itemUM: "PCS",
//     itemQty: 35,
//   },
//   {
//     itemCode: "DIAM-02",
//     itemName: "Hex Nut 16mm",
//     itemUM: "PCS",
//     itemQty: 58,
//   },
// ];
// const DO_LABELS = {
//   invoiceRef: "DO Delivery Invoice Ref",
//   deliveryInvoiceno: "DO Delivery Invoice Number",
//   deliveryNoteRef: "DO Delivery Note Ref",
//   deliveryNoteNumber: "DO Delivery Note Number",
//   customDocDate: "DO Custom Document Date",
//   customDocType: "DO Custom Document Type",
//   customDocNumber: "DO Custom Document Number",
//   deliveryDate: "DO Delivery Date",
//   totalQty: "DO Total Quantity",
// };


// const ammicDeliverySummary = {
//   a_dodInvRef: "REF-7788",
//   a_dodInvNo: "INV-DO-7788",
//   a_dodNoteReff: "NOTE-REF-22",
//   a_dodNoteNo: "DN-8899",
//   a_docDocDate: "14-Jan-2026",
//   a_docDocType: "BILL",
//   a_docDocNo: "DOC-5544",
//   a_dodDate: "14-Jan-2026",
//   a_doTotQty: ammicDeliveryItems.reduce(
//     (sum, i) => sum + i.itemQty,
//     0
//   ),
// };


const SectionBody = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      px: 2,
      pt: 0.5,
      pb: 1,
      borderBottom: "1px solid #E5E7EB",
    }}
  >
    {children}
  </Box>
);

const SectionTable = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      flex: 1,
      overflow: "auto",
      px: 1,
      pt: 2,
    }}
  >
    {children}
  </Box>
);

const InvoiceItemsTable = ({
  rows,
}: {
  rows: any[];
}) => (
  <Table
    size="small"
    sx={{
      "& .MuiTableCell-root": {
        fontSize: "12px",
        padding: "4px 8px",
      },
      "& .MuiTableHead-root .MuiTableCell-root": {
        fontSize: "11.5px",
        fontWeight: 600,
        backgroundColor: "#F9FAFB",
      },
      "& .MuiTableRow-root": {
        height: 30,
      },
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell>Item Number</TableCell>
        <TableCell>Item Code</TableCell>
        <TableCell>Item Name</TableCell>
        <TableCell>Qty</TableCell>
        <TableCell>Unit</TableCell>
        <TableCell align="right">Unit Price</TableCell>
        <TableCell align="right">Total Price</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {rows?.length > 0 ? (
        rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              {row.Invoice_Number ?? "-"}
            </TableCell>

            <TableCell>
              {row.Invoice_ItemCode ?? "-"}
            </TableCell>

            <TableCell>
              {row.Invoice_ItemName ?? "-"}
            </TableCell>

            <TableCell>
              {row.Invoice_ItemQty ?? "0"}
            </TableCell>

            <TableCell>
              {row.Invoice_ItemQtyUnitOfMeasurement ?? "-"}
            </TableCell>

            <TableCell align="right">
              {row.Invoice_ItemUnitPrice ?? "0.00"}
            </TableCell>

            <TableCell align="right">
              {row.Invoice_ItemTotalPrice ?? "0.00"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} align="center">
            No Invoice Items Found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

const DeliveryItemsTable = ({
  rows,
}: {
  rows: any[];
}) => (
  <Table
    size="small"
    sx={{
      "& .MuiTableCell-root": {
        fontSize: "12px",
        padding: "4px 8px",
      },
      "& .MuiTableHead-root .MuiTableCell-root": {
        fontSize: "11.5px",
        fontWeight: 600,
        backgroundColor: "#F9FAFB",
      },
      "& .MuiTableRow-root": {
        height: 30,
      },
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell>Item Code</TableCell>
        <TableCell>Item Name</TableCell>
        <TableCell>PO Number</TableCell>
        <TableCell>Unit</TableCell>
        <TableCell>Qty</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {rows?.length > 0 ? (
        rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              {row.DO_ItemCode ?? "-"}
            </TableCell>

            <TableCell>
              {row.DO_ItemName ?? "-"}
            </TableCell>

            <TableCell>
              {row.DO_Item_PO_Number ?? "-"}
            </TableCell>

            <TableCell>
              {row.DO_ItemUnitMeasurement ?? "-"}
            </TableCell>

            <TableCell>
              {row.DO_ItemQty ?? "0"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No Delivery Items Found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

const ItemsTable = ({
  rows,
  view,
  showFlag,
}: {
  rows: any[];
  view: "INVOICE" | "DELIVERY";
  showFlag: boolean;
}) => (
  <Table
    size="small"
    sx={{
      "& .MuiTableCell-root": {
        fontSize: "12px",
        padding: "4px 8px",
      },
      "& .MuiTableHead-root .MuiTableCell-root": {
        fontSize: "11.5px",
        fontWeight: 600,
        backgroundColor: "#F9FAFB",
      },
      "& .MuiTableRow-root": {
        height: 30,
      },
    }}
  >
    <TableHead>
      <TableRow>
        {view === "INVOICE" ? (
          <>
            <TableCell>Invoice Item Code</TableCell>
            <TableCell>Invoice Item Name</TableCell>
            <TableCell>Invoice Item Qty</TableCell>
            <TableCell align="right">
              Invoice Item Total Price
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>DO Item Code</TableCell>
            <TableCell>DO Item Name</TableCell>
            <TableCell>DO Item Unit Measurement</TableCell>
            <TableCell>DO Item Qty</TableCell>
          </>
        )}
      </TableRow>
    </TableHead>

    <TableBody>
      {rows?.length > 0 ? (
        rows.map((row, index) => (
          <TableRow key={index}>
            {view === "INVOICE" ? (
              <>
                <TableCell
                  sx={{
                    color:
                      showFlag &&
                        row.Invoice_TotalPrice_Matched === "Y"
                        ? "success.main"
                        : showFlag &&
                          row.Invoice_TotalPrice_Matched === "N"
                          ? "error.main"
                          : "inherit",
                    fontWeight: showFlag ? 600 : 400,
                  }}
                >
                  {row.Invoice_ItemCode ??
                    row.Invoice_Number ??
                    "-"}
                </TableCell>

                <TableCell>
                  {row.Invoice_ItemName ?? "-"}
                </TableCell>

                <TableCell>
                  {row.Invoice_ItemQty ?? "0"}
                </TableCell>

                <TableCell align="right">
                  {row.Invoice_ItemTotalPrice ?? "0.00"}
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  {row.DO_ItemCode ?? "-"}
                </TableCell>

                <TableCell>
                  {row.DO_ItemName ?? "-"}
                </TableCell>

                <TableCell>
                  {row.DO_ItemUnitMeasurement ?? "-"}
                </TableCell>

                <TableCell>
                  {row.DO_ItemQty ?? "0"}
                </TableCell>
              </>
            )}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} align="center">
            No Items Found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

const Field = ({
  label,
  value,
  color = "inherit",
}: {
  label: string;
  value?: any;
  color?: string;
}) => (
  <Box>
    <Typography fontSize={12} color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={500} fontSize="12px" color={color}>
      {value ?? "-"}
    </Typography>
  </Box>
);

const SummaryHeaderInvoice = ({
  data,
  view,
}: {
  data: any;
  view: "INVOICE" | "DELIVERY";
}) => {
  if (!data) return null;

  // ==========================
  // DELIVERY VIEW
  // ==========================
  if (view === "DELIVERY") {
    const formatDate = (date?: string) => {
      if (!date) return "-";

      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";

      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const safeValue = (val: any) => {
      return val ?? "-";
    };

    return (
      <Box>
        <Typography
          fontSize={13}
          fontWeight={550}
          color="#0F172A"
          mt={0.5}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Delivery Order
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          <Field
            label="DO Delivery Invoice Ref"
            value={safeValue(data.DO_InvoiceRef)}
          />

          <Field
            label="DO Delivery Invoice Number"
            value={safeValue(data.DO_InvoiceNumber)}
          />

          <Field
            label="DO Delivery Note Ref"
            value={safeValue(data.DO_DeliveryNoteRef)}
          />

          <Field
            label="DO Delivery Note Number"
            value={safeValue(data.DO_DeliveryNoteNumber)}
          />

          <Field
            label="DO Custom Document Date"
            value={formatDate(data.DO_CustomDocumentDate)}
          />

          <Field
            label="DO Custom Document Type"
            value={safeValue(data.DO_CustomDocumentType)}
          />

          <Field
            label="DO Custom Document Number"
            value={safeValue(data.DO_CustomDocumentNumber)}
          />

          <Field
            label="DO Delivery Date"
            value={formatDate(data.DO_DeliveryDate)}
            color={
              data.DO_DeliveryDate_Matched === "Y"
                ? "success.main"
                : data.DO_DeliveryDate_Matched === "N"
                  ? "error.main"
                  : "inherit"
            }
          />

          <Field
            label="DO Total Quantity"
            value={safeValue(data.DO_TotalQuantity)}
          />
        </Box>
      </Box>
    );
  }

  // ==========================
  // INVOICE VIEW
  // ==========================
  return (
    <Box>
      <Typography fontSize={13} fontWeight={550} color="#0F172A">
        {data.InvoiceVendor_Name ?? "-"}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
        <Field
          label="Invoice Date"
          value={data.Invoice_Date}
          color={
            data.Invoice_Date_Matched === "Y"
              ? "success.main"
              : data.Invoice_Date_Matched === "N"
                ? "error.main"
                : "inherit"
          }
        />

        <Field
          label="Invoice Total Price"
          value={data.Invoice_TotalPrice}
          color={
            data.Invoice_TotalPrice_Matched === "Y"
              ? "success.main"
              : data.Invoice_TotalPrice_Matched === "N"
                ? "error.main"
                : "inherit"
          }
        />

        <Field label="Invoice Number" value={data.Invoice_Number} />

        <Field
          label="Invoice Delivery Note Number"
          value={data.Invoice_DeliveryNoteNumber}
        />

        <Field
          label="Invoice Total Quantity"
          value={data.Invoice_TotalQuantity}
        />
        <Field
          label="Invoice Reff."
          value={data.Invoice_ref ?? "-"}
        />
      </Box>
    </Box>
  );
};

// const SectionHeaderWithToggle = ({
//   title,
//   value,
//   onChange,
// }: {
//   title: string;
//   value: "OMI" | "AMMIC";
//   onChange: (v: "OMI" | "AMMIC") => void;
// }) => (
//   <Box
//     px={2}
//     py={1.5}
//     display="flex"
//     alignItems="center"
//     justifyContent="space-between"
//   >
//     <Typography  fontWeight={500} fontSize="12px">{title}</Typography>

//     <ToggleButtonGroup
//       size="small"
//       exclusive
//       value={value}
//       onChange={(_, v) => v && onChange(v)}
//       sx={{
//         height: 28,
//         "& .MuiToggleButton-root": {
//           px: 1.5,
//           fontSize: 12,
//           fontWeight: 600,
//           textTransform: "none",
//         },
//       }}
//     >
//       <ToggleButton value="OMI">OMI</ToggleButton>
//       <ToggleButton value="AMMIC">AMMIC</ToggleButton>
//     </ToggleButtonGroup>
//   </Box>
// );

// const DeliveryOrderHeader = ({ data }: { data: any }) => (
//   <Box
//     display="grid"
//     gridTemplateColumns="repeat(2, 1fr)"
//     gap={2}
//   >
//     <Box>
//       <Typography fontSize={12} color="text.secondary">
//         DO Date
//       </Typography>
//       <Typography  fontWeight={500} fontSize="12px">
//         {data.invoiceDate || "-"}
//       </Typography>
//     </Box>

//     <Box>
//       <Typography fontSize={12} color="text.secondary">
//         Item Count
//       </Typography>
//       <Typography  fontWeight={500} fontSize="12px">
//         {data.itemCount ?? "-"}
//       </Typography>
//     </Box>
//   </Box>
// );

export default function OMI() {
  const [pdfType, setPdfType] = useState<"original" | "masked">("original");
  const [pdfCollapsed, setPdfCollapsed] = useState(false); // default = expanded
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [itemView, setItemView] = useState<"INVOICE" | "DELIVERY">("INVOICE");
  const [ammicItemView, setAmmicItemView] = useState<"AMMIC" | "DELIVERY">("AMMIC");
  const [selectedView, setSelectedView] = useState<"INVOICE" | "DELIVERY">("INVOICE");
  // ===============================
  // STATE
  // ===============================

  const [invoiceSummary, setInvoiceSummary] = useState<InvoiceDoc | null>(null);
  const [invoiceDeliverySummary, setInvoiceDeliverySummary] = useState<DeliveryDoc | null>(null);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);

  const [invoiceAmmicSummary, setInvoiceAmmicSummary] = useState<InvoiceDoc | null>(null);
  const [invoiceDeliveryAmmicSummary, setInvoiceDeliveryAmmicSummary] = useState<DeliveryDoc | null>(null);

  const [invoiceAmmicItems, setInvoiceAmmicItems] = useState<InvoiceItem[]>([]);
  const [deliveryAmmicItems, setDeliveryAmmicItems] = useState<DeliveryItem[]>([]);
  // ===============================
  // PROCESS JSON DATA
  // ===============================

  const processJsonData = (data: any[]) => {
    if (!Array.isArray(data)) return;

    const invoiceDoc = data.find(
      (d): d is InvoiceDoc => d.document_type === "invoice"
    );

    const deliveryDoc = data.find(
      (d): d is DeliveryDoc => d.document_type === "delivery_notes"
    );
    console.log("Invoice Document:", invoiceDoc);
    console.log("Delivery Document:", deliveryDoc);
    // INVOICE
    setInvoiceSummary(invoiceDoc ?? null);
    setInvoiceItems(invoiceDoc?.items ?? []);
    // console.log("Invoice item:", invoiceDoc);
    // DELIVERY
    setInvoiceDeliverySummary(deliveryDoc ?? null);
    setDeliveryItems(deliveryDoc?.items ?? []);
    console.log("Delivery item:", deliveryItems);

  };
  const processAmmicJsonData = (data: any[]) => {
    if (!Array.isArray(data)) return;

    const invoiceDoc = data.find(
      (d): d is InvoiceDoc => d.document_type === "invoice"
    );

    const deliveryDoc = data.find(
      (d): d is DeliveryDoc => d.document_type === "delivery_notes"
    );
    console.log("Invoice ammic Document:", invoiceDoc);
    console.log("Delivery ammic Document:", deliveryDoc);
    // INVOICE
    setInvoiceAmmicSummary(invoiceDoc ?? null);
    setInvoiceAmmicItems(invoiceDoc?.items ?? []);
    // console.log("Invoice item:", invoiceDoc);
    // DELIVERY
    setInvoiceDeliveryAmmicSummary(deliveryDoc ?? null);
    setDeliveryAmmicItems(deliveryDoc?.items ?? []);
    console.log("Delivery ammic item:", deliveryItems);
  };



  /* ---------- ROUTE STATE ---------- */
  const {
    id: fileId,   // ✅ GET ID HERE
    fileName,
    supplierName,
    file_path,
    invoiceOrderNo,
    status: routeStatus,
    reconciliationStatus,
    a_BatchNo,
    a_InterfaceRmk,
    is_duplicate,
    startDate,     // ✅ ADD THIS
    endDate,       // ✅ ADD THIS
  } = location.state || {};


  // ===============================
  // LOAD JSON
  // ===============================

  useEffect(() => {
    if (!file_path) return;

    const cleanPath = file_path.replace(/^\/+/, "");
    const finalPath = cleanPath.endsWith(".json")
      ? cleanPath
      : `${cleanPath}.json`;

    const reviewedStatuses = [
      "Completed",
      "Pending ACCPAC Posting",
      "Failed ACCPAC",
    ];

    const isReviewed = reviewedStatuses.includes(routeStatus);

    // 🔥 Dynamic base paths
    const extractedBasePath = isReviewed
      ? "/s3://omi-afd-docubot-stage-app/reviewed/extracted_invoice/"
      : "/s3://omi-afd-docubot-stage-app/extracted_invoice/";

    const ammicBasePath = isReviewed
      ? "/s3://omi-afd-docubot-stage-app/reviewed/ammic_invoice/"
      : "/s3://omi-afd-docubot-stage-app/ammic_invoice/";

    const loadJson = async () => {
      try {
        const response = await fetch(`${extractedBasePath}${finalPath}`);
        console.log("Extracted Path:", `${extractedBasePath}${finalPath}`);

        if (!response.ok) {
          throw new Error("Failed to fetch Extracted JSON file");
        }

        const data = await response.json();
        processJsonData(data);
      } catch (error) {
        console.error("Failed to load Extracted JSON:", error);
      }
    };

    const loadAmmic = async () => {
      try {
        const response = await fetch(`${ammicBasePath}${finalPath}`);
        console.log("AMMIC Path:", `${ammicBasePath}${finalPath}`);

        if (!response.ok) {
          throw new Error("Failed to fetch AMMIC JSON file");
        }

        const data = await response.json();
        processAmmicJsonData(data);
      } catch (error) {
        console.error("Failed to load AMMIC JSON:", error);
      }
    };

    loadJson();
    loadAmmic();
  }, [file_path, routeStatus]);
  
  const isReconciliationMatched =
    reconciliationStatus === "Matched";
  /* ---------- STATE (ALL FIRST) ---------- */
  const [status, setStatus] = useState<StatusType>(
    routeStatus || "Pending Approval"
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [approveRemark, setApproveRemark] = useState("");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [invoiceJson, setInvoiceJson] = useState<any>(null);
  const [amicJson, setAmicJson] = useState<any>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [originalJson, setOriginalJson] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [extractedSource, setExtractedSource] = useState<"OMI" | "AMMIC">("OMI");
  const [ammicSource, setAmmicSource] = useState<"OMI" | "AMMIC">("AMMIC");

  /* ---------- DERIVED FLAGS ---------- */
  const isSupplierMissing =
    !supplierName || supplierName.trim().length === 0;

  const isReadOnly =
    status === "Approved" || status === "JDE-Success";

  /* ---------- REDIRECT IF INVALID ---------- */
  useEffect(() => {
    if (fileName) setSelectedFile(fileName);
  }, [fileName]);


  useEffect(() => {
    if (!file_path) return;
    const cleanFileName = file_path.replace(/^\/+/, "");
    console.log(file_path)
    const baseName = cleanFileName.replace(/\.[^/.]+$/, "");
    const folderName = baseName.substring(0, baseName.indexOf("_"));
    let url = "";
    if (pdfType === "original") {
      url = `/s3://omi-afd-docubot-stage-source/processed/${file_path}.pdf`;
    } else {
      url = `s3://omi-afd-docubot-stage-intermediate/masked_pdf/${file_path}.pdf`;
    }
    console.log("Final URL:", url);
    setPdfUrl(url);
  }, [selectedFile, pdfType]);

  useEffect(() => {
    if (jsonData && !originalJson) {
      setOriginalJson(jsonData);
    }
  }, [jsonData]);


  /* ---------- REJECT HANDLER (copied from OCB) ---------- */
  const handleRevert = () => {
    setJsonData(originalJson);
    setIsEditing(false);
  };

  const handleReject = async () => {
    try {
      if (!fileId) {
        console.error("File ID missing");
        return;
      }
      console.log(fileId)
      const response = await processingLogService.updateStatus(
        [fileId],      // ✅ Pass as array
        "Rejected",
        rejectReason
      );

      if (!response?.updated_ids) {
        throw new Error("Invalid API response");
      }

      setStatus("Rejected");
      setRejectOpen(false);
      setRejectReason("");

    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const handleApprove = async () => {
    try {
      if (!fileId) {
        console.error("File ID missing");
        return;
      }

      const response = await processingLogService.updateStatus(
        [fileId],        // ✅ Pass as array
        "Approved",
        approveRemark || ""
      );

      if (!response?.updated_ids) {
        throw new Error("Invalid API response");
      }

      setStatus("Approved");
      setApproveOpen(false);
      setApproveRemark("");

    } catch (err) {
      console.error("Approve failed", err);
    }
  };
  const handleSave = () => {
    // 🔥 API call can go here if needed
    // await saveJson(jsonData)

    setIsEditing(false);
    setOriginalJson(null);
  };

  const handleEdit = () => {
    setOriginalJson(JSON.parse(JSON.stringify(jsonData))); // deep copy
    setIsEditing(true);
  };
  /* ---------- PDF ---------- */
  const handleOpenPdf = () => {
    if (!fileName) return;

    const url = getPdfUrlOriginal(fileName);
    const finalUrl = url.startsWith("/") ? url : `/${url}`;

    window.open(finalUrl, "_blank"); // ✅ opens in new tab
  };

  const TypedReconciliationTable =
    ReconciliationTable as React.ComponentType<{ rows: RowType[] }>;

  /* ---------- COLUMN ---------- */
  /* ================= UI ================= */
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >

      {/* ===== HEADER ===== */}
      <Paper
        sx={{
          mb: 0.5,
          mt: 0.5,
          px: 1.5,
          py: 1.5,
          borderRadius: 2,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            // 🔥 Make Supplier Name wider
            gridTemplateColumns: "2fr repeat(6, 1fr) auto",
            alignItems: "start", // allow wrapping height expansion
            gap: 1.5,
          }}
        >
          {[
            { label: "Supplier Name", value: supplierName || "-" },
            { label: "Invoice No.", value: invoiceOrderNo || "-" },
            { label: "Reconciliation Status", value: reconciliationStatus || "-" },
            { label: "Confidence", value: "0.97" },
            { label: "Batch No.", value: a_BatchNo || "787346" },
            { label: "Interface Remark", value: a_InterfaceRmk || "Quality Best" },
            { label: "Duplicate", value: is_duplicate || "Y" },
          ].map((item, index) => {
            const isSupplier = index === 0;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  pr: index < 6 ? 2 : 0,
                  borderRight: index < 6 ? "1px solid #E5E7EB" : "none",
                }}
              >
                <Typography
                  fontSize={9}
                  color="text.secondary"
                  sx={{ mb: 0.25 }}
                >
                  {item.label}
                </Typography>

                <Typography
                  fontWeight={600}
                  fontSize={11}
                  // 🔥 Wrap only Supplier Name
                  sx={{
                    whiteSpace: isSupplier ? "normal" : "nowrap",
                    wordBreak: isSupplier ? "break-word" : "normal",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            );
          })}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Chip
              label={status}
              size="small"
              color={
                status === "Approved" || status === "JDE-Success"
                  ? "success"
                  : status === "Rejected"
                    ? "error"
                    : "warning"
              }
              sx={{ fontWeight: 600, fontSize: 10, height: 22 }}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          flex: 1,           // take remaining space
          display: "flex",
          gap: 0.5,
          overflow: "hidden", // scrollable inside tables/PDF
        }}
      >

        {/* -------- PDF Preview -------- */}
        <Paper
          sx={{
            flex: pdfCollapsed ? "0 0 50px" : 1,
            height: "100%",
            transition: "all 0.35s ease",
            overflow: pdfCollapsed ? "hidden" : "hidden",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <Box
            px={1.5}
            py={0.75}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: 40 }}
          >
            {!pdfCollapsed && (
              <Stack direction="row" spacing={1} alignItems="center">
                <DescriptionIcon sx={{ fontSize: 18 }} />

                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                  }}
                >
                  Invoice / Delivery Order PDF
                </Typography>

                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={pdfType}
                  onChange={(_, value) => value && setPdfType(value)}
                  sx={{
                    height: 26,
                    "& .MuiToggleButton-root": {
                      px: 1,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "none",
                    },
                  }}
                >
                  <ToggleButton value="original">Original</ToggleButton>
                  <ToggleButton value="masked">Masked</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            )}

            <IconButton
              onClick={() => setPdfCollapsed(!pdfCollapsed)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1.5,
                backgroundColor: "rgba(0, 94, 184)",
                color: "#F1F5FF",
                "&:hover": {
                  backgroundColor: "#1E40AF",
                },
              }}
            >
              {pdfCollapsed ? (
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              ) : (
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Box>

          <Divider />
          {/* PDF VIEW */}
          {!pdfCollapsed && (
            <Box p={1.5} flex={1} height="100%">
              <PdfViewer pdfUrl={pdfUrl} />
            </Box>
          )}
        </Paper>
        {/* -------- Table Data -------- */}
        <Paper
          sx={{
            flex: pdfCollapsed ? 1.7 : 1,
            transition: "all 0.35s ease",
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: 40,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              Extracted Data
            </Typography>

            {false && (
              <ToggleButtonGroup
                size="small"
                exclusive
                value={selectedView}
                onChange={(_, v) => v && setSelectedView(v)}
                sx={{
                  height: 28,
                  "& .MuiToggleButton-root": {
                    px: 1.5,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "none",
                  },
                }}
              >
                <ToggleButton value="INVOICE">Invoice</ToggleButton>
                <ToggleButton value="DELIVERY">Delivery Order</ToggleButton>
              </ToggleButtonGroup>
            )}

          </Box>

          <Divider />

          {/* Top 25% */}
          <SectionBody>
            <SummaryHeaderInvoice
              data={
                selectedView === "DELIVERY"
                  ? invoiceDeliverySummary ?? {}
                  : invoiceSummary ?? {}
              }
              view={selectedView}
            />
          </SectionBody>

          <Divider />

          <SectionTable>
            {selectedView === "INVOICE" ? (
              <InvoiceItemsTable rows={invoiceItems} />
            ) : (
              <DeliveryItemsTable
                rows={deliveryItems}
              />
            )}
          </SectionTable>
        </Paper>
        <Paper
          sx={{
            flex: pdfCollapsed ? 1.7 : 1,
            height: "100%",
            borderRadius: 2,
            transition: "flex 0.35s ease",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: 40,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              AMMIC Data
            </Typography>

            <ToggleButtonGroup
              size="small"
              exclusive
              value={selectedView}
              onChange={(_, v) => v && setSelectedView(v)}
              sx={{
                height: 28,
                "& .MuiToggleButton-root": {
                  px: 1.5,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "none",
                },
              }}
            >
              <ToggleButton value="INVOICE">Invoice</ToggleButton>
              <ToggleButton value="DELIVERY">Delivery Order</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />
          <SectionBody>
            <SummaryHeaderInvoice
              data={
                selectedView === "DELIVERY"
                  ? invoiceDeliveryAmmicSummary ?? {}
                  : invoiceAmmicSummary ?? {}
              }
              view={selectedView}
            />
          </SectionBody>

          <Divider />

          <SectionTable>
            {selectedView === "INVOICE" ? (
              <InvoiceItemsTable
                rows={invoiceAmmicItems}
              />
            ) : (
              <DeliveryItemsTable
                rows={deliveryAmmicItems}
              />
            )}
          </SectionTable>

        </Paper>

      </Box>
      {/* ===== FOOTER ===== */}
      <Paper
        elevation={1} // subtle shadow
        sx={{
          mt: 2,
          borderRadius: 3,
          bgcolor: "#f3f4f6", // use bgcolor instead of backgroundColor
          overflow: "hidden",  // ensures children don’t exceed borders
          flexShrink: 0,   // prevent shrinking
        }}
      >
        <Box
          px={2.5}
          py={1.5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT SIDE – Remark */}
          <Typography
            fontSize={12} // smaller text
            color="text.primary"
            sx={{ flex: 1 }}
          >
            Please provide a reason for rejection
          </Typography>

          {/* RIGHT SIDE – Actions */}
          <Box display="flex" gap={1} alignItems="center">
            {/* Back Button */}
            <Button
              variant="outlined"
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                height: 28,
                px: 2,
                fontSize: 11,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
                "&:active": {
                  opacity: 0.9,
                },
              }}
              onClick={() =>
                navigate("/Dashboard", {
                  state: {
                    startDate,
                    endDate,
                  },
                })
              }            >
              Back
            </Button>

            {/* Reject Button */}
            <Button
              variant="contained"
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                height: 28,
                px: 2,
                fontSize: 11,
                backgroundColor: "#d14343",
                "&:hover": {
                  backgroundColor: "#d14343",
                  opacity: 0.9,
                },
                "&:active": {
                  backgroundColor: "#d14343",
                  opacity: 0.95,
                },
              }}
              disabled={
                status === "Rejected" ||
                status === "Approved" ||
                isSupplierMissing
              }
              onClick={() => setRejectOpen(true)}
            >
              Reject
            </Button>

            {/* Approve Button */}
            <Button
              variant="contained"
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                height: 28,
                px: 2,
                fontSize: 11,
                backgroundColor: "#005eb8",
                "&:hover": {
                  backgroundColor: "#005eb8",
                  opacity: 0.9,
                  boxShadow: "0 2px 6px rgba(0, 94, 184, 0.25)",
                },
                "&:active": {
                  backgroundColor: "#005eb8",
                  opacity: 0.95,
                  boxShadow: "0 3px 8px rgba(0, 94, 184, 0.3)",
                },
              }}
              disabled={status !== "Pending Approval" || isSupplierMissing}
              onClick={() => {
                if (isReconciliationMatched) {
                  handleApprove();
                } else {
                  setApproveOpen(true);
                }
              }}
            >
              Approve
            </Button>
          </Box>
        </Box>
      </Paper>


      {/* ===== REJECT DIALOG ===== */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
            boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 15,
            borderBottom: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          Reject File
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography
            fontSize={13}
            color="text.secondary"
            sx={{ mt: 1.5 }}
          >
            Please provide a reason for rejection
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            size="small"
            placeholder="Enter rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1.5 }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setRejectOpen(false)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              height: 28,
              px: 2,
              fontSize: 11,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
              "&:active": {
                opacity: 0.9,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              height: 28,
              px: 2,
              fontSize: 11,
              backgroundColor: "#d14343",
              "&:hover": {
                backgroundColor: "#d14343",
                opacity: 0.9,
              },
              "&:active": {
                backgroundColor: "#d14343",
                opacity: 0.95,
              },
            }} disabled={!rejectReason.trim()}
            onClick={handleReject}
          >
            Submit Reject
          </Button>
        </DialogActions>
      </Dialog>
      {/* ===== APPROVE DIALOG ===== */}
      <Dialog
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={600}>Approve</DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color="text.secondary" mb={1}>
            {isReconciliationMatched
              ? "Add approval remark (optional)"
              : "Add approval remark (mandatory)"}
          </Typography>


          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Enter approval remark"
            value={approveRemark}
            onChange={(e) => setApproveRemark(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApproveOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={
              !isReconciliationMatched && !approveRemark.trim()
            }
            onClick={handleApprove}
          >
            Submit Approval
          </Button>

        </DialogActions>
      </Dialog>

    </Box >
  );
}
