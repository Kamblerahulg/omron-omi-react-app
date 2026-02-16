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
import { getPdfUrl } from "../api/omiApi";
import PdfViewer from "../components/PdfViewer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

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

const invoiceItems = [
  { itemNo: "ITM-01", itemName: "Steel Bolt 12mm", qty: 10, amount: 50000, flag: "Y" },
  { itemNo: "ITM-02", itemName: "Hex Nut 12mm", qty: 5, amount: 40000, flag: "N" },
  { itemNo: "ITM-03", itemName: "Washer 12mm", qty: 7, amount: 35000, flag: "Y" },
];

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

const invoiceSummary = {
  supplierName: "Singapore NLB Pte.",
  invoiceDate: "21-Feb-2026",
  invoicetotalprice: "$ 31,600",
  invoicetotalqty: 65,
  invoicedeliverynoteno: "IN-IS-9374",
  invoiceReff: "INV-3673",
  ismatch_invdate: "Y" as "Y",
  ismatch_invtotalprice: "N" as "N",
  ismatch_invreff: "Y" as "Y",
};


const ammicInvoiceSummary = {
  supplierName: "OMRON Client Pte.",
  a_invoiceDate: "25-Jun-2026",
  a_invoicetotalprice: "$ 98,400",
  a_invoicetotalqty: 99,
  a_invoicedeliverynoteno: "DN-AM-4455",
  a_invoiceReff: "AMMIC-REF-8899",
};

const ammicDeliveryItems = [
  {
    itemCode: "DIAM-41",
    itemName: "Steel Bolt 16mm",
    itemUM: "PCS",
    itemQty: 35,
  },
  {
    itemCode: "DIAM-02",
    itemName: "Hex Nut 16mm",
    itemUM: "PCS",
    itemQty: 58,
  },
];
const DO_LABELS = {
  invoiceRef: "DO Delivery Invoice Ref",
  deliveryInvoiceno: "DO Delivery Invoice Number",
  deliveryNoteRef: "DO Delivery Note Ref",
  deliveryNoteNumber: "DO Delivery Note Number",
  customDocDate: "DO Custom Document Date",
  customDocType: "DO Custom Document Type",
  customDocNumber: "DO Custom Document Number",
  deliveryDate: "DO Delivery Date",
  totalQty: "DO Total Quantity",
};


const ammicDeliverySummary = {
  a_dodInvRef: "REF-7788",
  a_dodInvNo: "INV-DO-7788",
  a_dodNoteReff: "NOTE-REF-22",
  a_dodNoteNo: "DN-8899",
  a_docDocDate: "14-Jan-2026",
  a_docDocType: "BILL",
  a_docDocNo: "DOC-5544",
  a_dodDate: "14-Jan-2026",
  a_doTotQty: ammicDeliveryItems.reduce(
    (sum, i) => sum + i.itemQty,
    0
  ),
};

const deliveryItems = [
  { itemCode: "DI-01", itemName: "Steel Bolt 12mm", itemUM: "PCS", itemQty: 5, flag: "N" },
  { itemCode: "DI-02", itemName: "Hex Nut 12mm", itemUM: "PCS", itemQty: 52, flag: "N" },
  { itemCode: "DO-03", itemName: "Washer 12mm", itemUM: "PCS", itemQty: 68, flag: "Y" },
];

const invoiceDeliverySummary = {
  i_dodInvRef: "OMI-REF-7788",
  i_dodInvNo: "OMI-DO-7788",
  i_dodNoteReff: "OMI-NOTE-REF",
  i_dodNoteNo: "OMI-DN-8899",
  i_docDocDate: "13-Jan-2026",
  i_docDocType: "BILL",
  i_docDocNo: "OMI-DOC-5544",
  i_dodDate: "13-Jan-2026",
  ismatch_ideliverydate: "N" as "N",
  i_doTotQty: deliveryItems.reduce(
    (sum, i) => sum + i.itemQty,
    0
  ),
};

const SectionBody = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      px: 2,
      pt: 0.5,
      pb: 1,
    }}
  >
    {children}
  </Box>
);

const SectionTable = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      flex: 1,                  // ✅ takes remaining height
      overflow: "auto",
      px: 1,
      pt: 2,
    }}
  >
    {children}
  </Box>
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
        fontSize: "12px",      // 🔥 smaller font
        padding: "4px 8px",    // 🔥 reduce cell padding
      },
      "& .MuiTableHead-root .MuiTableCell-root": {
        fontSize: "11.5px",    // 🔥 slightly smaller header
        fontWeight: 600,
        backgroundColor: "#F9FAFB",
      },
      "& .MuiTableRow-root": {
        height: 30,            // 🔥 compact row height
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
      {rows.map((row, index) => (
        <TableRow key={index}>
          {view === "INVOICE" ? (
            <>
              <TableCell
                sx={{
                  color:
                    showFlag && row.flag
                      ? row.flag === "Y"
                        ? "success.main"
                        : "error.main"
                      : "inherit",
                  fontWeight: showFlag ? 600 : 400,
                }}
              >
                {row.itemNo}
              </TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.qty}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </>
          ) : (
            <>
              <TableCell>{row.itemCode}</TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.itemUM}</TableCell>
              <TableCell>{row.itemQty}</TableCell>
            </>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);


const SummaryHeaderAMMIC = ({
  data,
  view,
}: {
  data: any;
  view: "AMMIC" | "DELIVERY";
}) => {
  if (view === "DELIVERY") {
    return (
      <Box>
        <Typography
          fontSize={13}
          fontWeight={550}
          color="#0F172A"
          mt={0.5}
          mb={0}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: "3px",   // spacing between text & line
          }}
        >
          Delivery Order
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.invoiceRef}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_dodInvRef ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryInvoiceno}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_dodInvNo ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryNoteRef}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_dodNoteReff ?? "-"}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryNoteNumber}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_dodNoteNo ?? "-"}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocDate}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_docDocDate ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocType}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_docDocType ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocNumber}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_docDocNo ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryDate}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_dodDate ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.totalQty}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.a_doTotQty ?? "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }


  // ✅ INVOICE VIEW (default)
  return (
    <Box>
      <Typography
        fontSize={13}
        fontWeight={550}
        color="#0F172A"
      >
        {data.supplierName || "-"}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap={2}
      >
        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Date
          </Typography>
          <Typography fontWeight={500} fontSize="12px">
            {data.a_invoiceDate || "-"}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Total Price
          </Typography>
          <Typography fontWeight={500} fontSize="12px">
            {data.a_invoicetotalprice ?? "-"}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Number
          </Typography>
          <Typography fontWeight={500} fontSize="12px" >
            {data.a_invoicetotalqty || "-"}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Delivery Note Number
          </Typography>
          <Typography fontWeight={500} fontSize="12px">
            {data.a_invoicedeliverynoteno || "-"}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Total Quantity
          </Typography>
          <Typography fontWeight={500} fontSize="12px">
            {data.a_invoicetotalqty || "-"}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={12} color="text.secondary">
            Invoice Reff.
          </Typography>
          <Typography fontWeight={500} fontSize="12px">
            {data.a_invoiceReff || "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const SummaryHeaderInvoice = ({
  data,
  flags, // <-- new prop
  view,
}: {
  data: any;
  flags?: {
    ismatch_invdate?: "Y" | "N";
    ismatch_invtotalprice?: "Y" | "N";
    ismatch_invreff?: "Y" | "N";
    ismatch_ideliverydate?: "Y" | "N";
  };
  view: "INVOICE" | "DELIVERY";
}) => {
  if (view === "DELIVERY") {
    return (
      <Box>
        <Typography
          fontSize={13}
          fontWeight={550}
          color="#0F172A"
          mt={0.5}
          mb={0}
          sx={{
            textDecoration: "underline",
            textUnderlineOffset: "3px",   // spacing between text & line
          }}
        >
          Delivery Order
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.invoiceRef}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_dodInvRef ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryInvoiceno}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_dodInvNo ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryNoteRef}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_dodNoteReff ?? "-"}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryNoteNumber}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_dodNoteNo ?? "-"}
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocDate}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_docDocDate ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocType}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_docDocType ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.customDocNumber}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_docDocNo ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.deliveryDate}
            </Typography>
            <Typography fontWeight={500} fontSize="12px" color={
              flags?.ismatch_ideliverydate === "Y"
                ? "success.main"
                : flags?.ismatch_ideliverydate === "N"
                  ? "error.main"
                  : "inherit"
            }
            >
              {data.i_dodDate ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              {DO_LABELS.totalQty}
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.i_doTotQty ?? "-"}
            </Typography>
          </Box>
        </Box>
      </Box >
    );
  }


  // ✅ INVOICE VIEW (default)
  return (
    <Box>
      <Typography fontSize={13}
        fontWeight={550} color="#0F172A">
        {data.supplierName || "-"}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
        {/* Invoice Date */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Invoice Date
            </Typography>
            <Typography fontWeight={500} fontSize="12px" color={flags.ismatch_invdate === "Y" ? "success.main" : "error.main"}>
              {data.invoiceDate || "-"}
            </Typography>
          </Box>
        </Box>

        {/* Invoice Total Price */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Invoice Total Price
            </Typography>
            <Typography fontWeight={500} fontSize="12px" color={flags.ismatch_invtotalprice === "Y" ? "success.main" : "error.main"}>
              {data.invoicetotalprice || "-"}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Invoice Number
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.invoiceReff || "-"}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Invoice Delivery Note Number
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.invoicedeliverynoteno || "-"}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Invoice Total Quantity
            </Typography>
            <Typography fontWeight={500} fontSize="12px">
              {data.invoicetotalqty || "-"}
            </Typography>
          </Box>
        </Box>

        {/* Invoice Reff */}
        <Box display="flex" flexDirection="column">
          <Typography fontSize={12} color="text.secondary">
            Invoice Reff.
          </Typography>

          <Typography fontWeight={500} fontSize="12px" color={flags.ismatch_invreff === "Y" ? "success.main" : "error.main"}>
            {data.invoiceReff || "-"}
          </Typography>
        </Box>

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

  /* ---------- ROUTE STATE ---------- */
  const {
    fileName,
    supplierName,
    invoiceOrderNo,
    status: routeStatus,
    reconciliationStatus,
    a_BatchNo,
    a_InterfaceRmk,
    is_duplicate,
  } = location.state || {};

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
    if (!selectedFile) return;

    const url =
      pdfType === "original"
        ? getPdfUrl(selectedFile)
        : getPdfUrl(`masked/${selectedFile}`); // adjust if API differs

    setPdfUrl(url.startsWith("/") ? url : `/${url}`);
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
      await rejectFile({
        fileName,
        reason: rejectReason,
        targetBucket: "Rejected_S3",
      });

      setStatus("Rejected");
      setRejectOpen(false);
      setRejectReason("");
    } catch (err) {
      console.error("Reject failed", err);
    }
  };
  const handleApprove = async () => {
    try {
      // await approveFile({ fileName, remark: approveRemark });

      setStatus("Approved");
      setApproveOpen(false);
      setApproveRemark(""); // reset
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

    const url = getPdfUrl(fileName);
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
          px: 2,
          py: 2,
          borderRadius: 2,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)", // 7 fields + chip
            alignItems: "center",
            gap: 2,
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
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0, // IMPORTANT (prevents overflow)
              }}
            >
              <Typography
                fontSize={10}
                color="text.secondary"
                noWrap
              >
                {item.label}
              </Typography>

              <Typography
                fontWeight={600}
                fontSize={13}
                noWrap
              >
                {item.value}
              </Typography>
            </Box>
          ))}

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
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 0.5, // 🔥 reduced from 2 → 1 (16px → 8px)
          overflow: "hidden",
        }}
      >

        {/* -------- PDF Preview -------- */}
        <Paper
          sx={{
            flex: pdfCollapsed ? "0 0 64px" : 1,
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
            borderRadius: 2,
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
              data={selectedView === "DELIVERY" ? invoiceDeliverySummary : invoiceSummary}
              view={selectedView}
              flags={
                selectedView === "INVOICE"
                  ? {
                    ismatch_invdate: invoiceSummary.ismatch_invdate,
                    ismatch_invtotalprice: invoiceSummary.ismatch_invtotalprice,
                    ismatch_invreff: invoiceSummary.ismatch_invreff,
                  }
                  : {
                    ismatch_ideliverydate: invoiceDeliverySummary.ismatch_ideliverydate,
                  }
              }

            />
          </SectionBody>

          <Divider />

          <SectionTable>
            <ItemsTable
              rows={selectedView === "INVOICE" ? invoiceItems : deliveryItems}
              view={selectedView}
              showFlag={selectedView === "INVOICE"}
            />
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
            <SummaryHeaderAMMIC
              data={selectedView === "DELIVERY" ? ammicDeliverySummary : ammicInvoiceSummary}
              view={selectedView === "DELIVERY" ? "DELIVERY" : "AMMIC"} // mapping INVOICE -> AMMIC
            />
          </SectionBody>

          <Divider />

          <SectionTable>
            <ItemsTable
              rows={selectedView === "INVOICE" ? normalizedAmmicInvoiceItems : ammicDeliveryItems}
              view={selectedView} // INVOICE or DELIVERY
              showFlag={false}
            />
          </SectionTable>

        </Paper>

      </Box>
      {/* ===== FOOTER ===== */}
      <Box
        sx={{
          borderTop: "1px solid #E5E7EB",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f3f4f6",
          position: "relative",   // ✅ NOT absolute or fixed
        }}
      >
        {/* LEFT SIDE – Remark */}
        <Typography
          fontSize={12}   // 🔥 reduced from 13
          color="text.primary"
          sx={{ flex: 1 }}
        >
          Please provide a reason for rejection
        </Typography>

        {/* RIGHT SIDE – Actions */}
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              minHeight: 30,
            }}
            onClick={() => navigate("/")}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              minHeight: 30,
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

          <Button
            variant="contained"
            size="small"
            sx={{
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              minHeight: 30,
              backgroundColor: "#005eb8",
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

      {/* ===== REJECT DIALOG ===== */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={600}>Reject File</DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color="text.secondary" mb={1}>
            Please provide a reason for rejection
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Enter rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            color="error"
            disabled={!rejectReason.trim()}
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
