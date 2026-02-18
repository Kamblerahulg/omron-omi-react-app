import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ✅ Fonts: move to index.css or HTML
// @import url('https://fonts.googleapis.com/css2?family=Shorai+Sans:wght@400;700&display=swap');


const STATUS_OPTIONS = [
  "Pending Approval",
  "Approved",
  "JDE-Success",
  "JDE-Error",
  "Duplicate",
  "Reject",
];

const Dashboard = () => {

  const token = localStorage.getItem("access_token");

  // fetch("https://mzx9xifx1h.execute-api.ap-southeast-1.amazonaws.com/dev/file-log", {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   },
  // });

  const navigate = useNavigate();

  // 🔹 Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierInput, setSupplierInput] = useState("");
  const [supplierOpen, setSupplierOpen] = useState(false);

  const [status, setStatus] = useState("Pending Approval");
  const [rstatus, setRstatus] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState("");
  const [bu, setBu] = useState("");
  const BU_OPTIONS = ["India", "Singapore", "Japan", "Malaysia"]; // map from API
  const RECON_STATUS_OPTIONS = [
    "Matched",
    "Mismatch",
    "Line Mismatch",
    "Orphan Invoice",
  ];
  const INV_TYPE = [
    "Direct",
    "Indirect",
  ];
  const auditMap: Record<number, typeof auditHistory> = {
    1: [
      {
        date: "26-01-2026",
        action: "Auto Approve",
        status: "Approved",
        IsSigned: "Y",
        user: "System",
        remark: "Auto approved after reconciliation",
        DDateMatched: "11-04-2026",
        invoicetype: "My Direct",
        isduplicate: "Y"
      },
    ],
    2: [
      {
        date: "25-01-2026",
        action: "Validation",
        IsSigned: "Y",
        status: "Pending Approval",
        user: "Batch Job",
        remark: "Validation successful",
        DDateMatched: "11-04-2026",
        invoicetype: "My Indirect",
        isduplicate: "N"
      },
    ],
    3: [
      {
        date: "24-01-2026",
        action: "Upload",
        IsSigned: "Y",
        status: "Uploaded",
        user: "Supplier",
        remark: "Invoice uploaded",
        DDateMatched: "11-04-2026",
        invoicetype: "My Indirect",
        isduplicate: "Y"
      },
    ],
  };

  const [reconStatus, setReconStatus] = useState("All");
  const [invType, setInvType] = useState("");
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const handleOpenAudit = (row: any) => {
    setSelectedAudit(row);
    setAuditOpen(true);
  };

  const compactFilter = {
    width: 110,

    "& .MuiInputLabel-root": {
      fontSize: 10,          // 🔥 smaller label
    },

    "& .MuiOutlinedInput-root": {
      height: 30,            // 🔥 reduced height
      fontSize: 11,          // 🔥 smaller text
      backgroundColor: "#fff",

      "& fieldset": {
        borderColor: "#E5E7EB",
      },
    },

    "& .MuiOutlinedInput-input": {
      padding: "4px 8px",    // 🔥 tighter padding
      fontSize: 11,
    },
  };



  // 🔹 Example data (replace with API/DynamoDB)
  const auditHistory = [
    {
      date: "26-01-2026",
      action: "Auto Approve",
      IsSigned: "Y",
      status: "Approved",
      user: "System",
      remark: "Auto approved after reconciliation",
      DDateMatched: "11-04-2026",
      invoicetype: "My Direct",
      isduplicate: "Y"
    },
    {
      date: "25-01-2026",
      action: "Validation",
      IsSigned: "Y",
      status: "Pending Approval",
      user: "Batch Job",
      remark: "Validation successful",
      DDateMatched: "11-04-2026",
      invoicetype: "My Indirect",
      isduplicate: "Y"
    },
    {
      date: "24-01-2026",
      action: "Upload",
      IsSigned: "Y",
      status: "Uploaded",
      user: "Supplier",
      remark: "Invoice uploaded",
      DDateMatched: "11-04-2026",
      invoicetype: "My Indirect",
      isduplicate: "N"
    },
  ];

  const rows = [
    {
      id: 1,
      processedDate: "20-01-2026",
      supplierName: "Tata Motors",
      bu: "Singapore-OMI-ID45",
      invoiceOrderNo: "SO-1001",
      invoiceDate: "14-05-2025",
      poNumber: "PO-9001",
      fileName: "ACTON_1",
      status: "Approved",
      reconciliationStatus: "Matched",
    },
    {
      id: 2,
      processedDate: "26-01-2026",
      supplierName: "Infosys",
      bu: "OMI-ID23",
      invoiceOrderNo: "SO-1002",
      invoiceDate: "07-12-2025",
      poNumber: "PO-9002",
      fileName: "ACTON_1",
      status: "Pending Approval",
      reconciliationStatus: "Mismatch",
    },
    {
      id: 3,
      processedDate: "16-01-2026",
      supplierName: "Clou-Kinetics",
      bu: "OMI-ID",
      invoiceOrderNo: "SASFUO-9781002",
      invoiceDate: "21-11-2025",
      poNumber: "PO-8352",
      fileName: "ACTON_1",
      status: "Pending Approval",
      reconciliationStatus: "Matched",
    },
  ];

  const [fileNameSearch, setFileNameSearch] = useState("");
  // const [poSearch, setPoSearch] = useState("");

  const toDate = (d: string) => new Date(d.split("-").reverse().join("-"));

  // 🔹 Supplier dropdown (DynamoDB – logged-in user scope)
  const supplierList = ["Tata Motors", "Infosys", "Reliance"]; // map from API

  // 🔹 Filter logic
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      return (
        (!supplierSearch ||
          r.supplierName.toLowerCase().includes(supplierSearch.toLowerCase())) &&
        (!status || r.status === status) &&
        (reconStatus === "All" ||
          r.reconciliationStatus === reconStatus) &&
        (!invoiceOrder ||
          r.invoiceOrderNo.toLowerCase().includes(invoiceOrder.toLowerCase())) &&
        (!fileNameSearch ||
          r.fileName.toLowerCase().includes(fileNameSearch.toLowerCase())) &&
        (!bu || r.bu === bu) &&
        (!startDate || toDate(r.processedDate) >= new Date(startDate)) &&
        (!endDate || toDate(r.processedDate) <= new Date(endDate))
      );
    });
  }, [
    rows,
    supplierSearch,
    status,
    reconStatus,
    invoiceOrder,
    fileNameSearch,
    bu,
  ]);

  const handlePostOrders = () => {
    const matchedRows = filteredRows.filter(
      (row) => row.reconciliationStatus === "Matched"
    );

    console.log("Posting Matched Orders:", matchedRows);
  };

  const handleExportCSV = () => {
    if (filteredRows.length === 0) return;

    // Define table headers (only visible table columns)
    const headers = [
      "Processed Date",
      "Supplier Name",
      "BU",
      "Invoice No",
      "Invoice Dt.",
      "Status",
      "Reconciliation Status",
    ];

    // Map rows to CSV format
    const csvRows = filteredRows.map((row) => [
      row.processedDate,
      row.supplierName,
      row.bu,
      row.invoiceOrderNo,
      row.invoiceDate,
      row.status,
      row.reconciliationStatus,
    ]);

    // Convert to CSV string
    const csvContent =
      [headers, ...csvRows]
        .map((e) =>
          e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    // Create blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `OMI_AFD_DocuBot_${new Date().toISOString().slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkApprove = () => {
    const matchedRows = filteredRows.filter(
      (row) => row.reconciliationStatus === "Matched"
    );

    console.log("Posting Matched Orders:", matchedRows);
  };

  return (
    <Box>
      <Box>
        <Typography
          fontFamily={`"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`}
          fontSize={18}
          fontWeight={600}
          mb={1}
        >
          OMI AFD DocuBot
        </Typography>
      </Box>


      {/* ================= Filters ================= */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={1}
        sx={{
          p: 1,
          borderRadius: 2,
          background: "#fff",
          border: "1px solid #E5E7EB",
          overflowX: "auto",     // 🔥 allows scroll instead of wrap
          whiteSpace: "nowrap",  // 🔥 force single row
        }}
      >


        {/* Start Date */}
        <TextField
          type="date"
          size="small"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={compactFilter}
        />

        {/* End Date */}
        <TextField
          type="date"
          size="small"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={compactFilter}
        />
        <FormControl size="small" sx={compactFilter}>
          <InputLabel id="bu-label">BU</InputLabel>
          <Select
            labelId="bu-label"
            value={bu}
            label="BU"
            onChange={(e) => setBu(e.target.value)}
            sx={compactFilter}
          >
            <MenuItem value="">
              <em>All BU</em>
            </MenuItem>

            {BU_OPTIONS.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Supplier */}
        <Autocomplete
          size="small"
          options={supplierList}
          sx={{
            ...compactFilter,
            width: 180,   // slightly wider than others
          }}
          open={supplierOpen}
          inputValue={supplierInput}
          onInputChange={(event, newInputValue) => {
            setSupplierInput(newInputValue);
            setSupplierOpen(newInputValue.length > 0);
            setSupplierSearch(newInputValue);
          }}
          onClose={() => setSupplierOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier Name"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />


        {/* Status */}
        <FormControl size="small" sx={compactFilter}>

          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={compactFilter}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reconciliation Status */}
        <FormControl size="small" sx={compactFilter}>
          <InputLabel id="recon-label">Reconciliation Status</InputLabel>
          <Select
            labelId="recon-label"
            label="Reconciliation"
            value={reconStatus}
            onChange={(e) => setReconStatus(e.target.value)}
            sx={compactFilter}
          >
            <MenuItem value="All">All</MenuItem>
            {RECON_STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Invoice Type */}
        <FormControl size="small" sx={compactFilter}>
          <InputLabel id="invtype-label">Invoice Type</InputLabel>
          <Select
            labelId="invtype-label"
            label="Invoice Type"
            value={invType}
            onChange={(e) => setInvType(e.target.value)}
            sx={compactFilter}
          >
            <MenuItem value="">All</MenuItem>
            {INV_TYPE.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Inovice Order */}
        <TextField
          size="small"
          label="Invoice Number"
          value={invoiceOrder}
          onChange={(e) => setInvoiceOrder(e.target.value)}
          sx={{ ...compactFilter, minWidth: 100 }}
        />
        {/* BU Filter */}


      </Box>
      {/* ================= Table ================= */}
      <Paper
        sx={{
          flex: 1,                 // ⬅️ takes remaining height
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >

        <TableContainer
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              width: "100%",
              tableLayout: "auto", // ✅ allow columns to auto-fit
              "& .MuiTableCell-root": {
                fontSize: 11,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingTop: 1,
                paddingBottom: 1,
              },
            }}
          >

            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  fontWeight: 600,
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >

              <TableRow>
                <TableCell sx={{ width: 110 }}>Processed Date</TableCell>
                <TableCell sx={{ width: 200 }}>Supplier Name</TableCell>
                <TableCell sx={{ width: 140 }}>BU</TableCell>
                <TableCell sx={{ width: 130 }}>Invoice No.</TableCell>
                <TableCell sx={{ width: 130 }}>Invoice Dt.</TableCell>

                {/* Keep these two CLOSE */}
                <TableCell sx={{ width: 140, textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell sx={{ width: 160, textAlign: "center" }}>
                  Reconciliation Status
                </TableCell>

                {/* Make these compact */}
                <TableCell sx={{ width: 120 }}>
                  Review Data
                </TableCell>
                <TableCell sx={{ width: 110, textAlign: "center" }}>
                  More Details
                </TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {filteredRows.map((row) => {
                // ✅ Define latestRecord here
                const latestRecord = auditMap[row.id]?.[0];

                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor: "#F8FAFF",
                        boxShadow:
                          "inset 0 0 0 1px #E0E7FF, 0 4px 12px rgba(99,102,241,0.08)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: 12 }}>{row.processedDate}</TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",        // 🔥 single line
                        overflow: "hidden",
                        textOverflow: "ellipsis",    // 🔥 show ...
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.supplierName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 12 }}>
                        {row.bu}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.invoiceOrderNo}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{row.invoiceDate}</TableCell>

                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 999,

                            background:
                              row.status === "Approved"
                                ? "linear-gradient(135deg,#34D399,#059669)"
                                : row.status === "Pending Approval"
                                  ? "linear-gradient(135deg,#60A5FA,#2563EB)"
                                  : "linear-gradient(135deg,#FBBF24,#D97706)",
                            color: "#fff",
                            boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.reconciliationStatus}
                        size="small"
                        sx={{
                          minWidth: 100,
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 2,
                          backgroundColor:
                            row.reconciliationStatus === "Matched"
                              ? "#ECFDF5"
                              : row.reconciliationStatus === "Mismatch"
                                ? "#FFF7ED"
                                : "#FEF2F2",
                          color:
                            row.reconciliationStatus === "Matched"
                              ? "#047857"
                              : row.reconciliationStatus === "Mismatch"
                                ? "#C2410C"
                                : "#B91C1C",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 120,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#2F6FED",
                        cursor: "pointer",
                        whiteSpace: "nowrap",   // 🔥 add this
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() =>

                        navigate("/omi", {
                          state: {
                            supplierName: row.supplierName, // ✅ FIX
                            fileName: row.fileName,
                            invoiceOrderNo: row.invoiceOrderNo,
                            status: row.status,
                            reconciliationStatus: row.reconciliationStatus,
                          },
                        })
                      }

                    >
                      {row.fileName}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        placement="left"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#FFFFFF",
                              color: "#0F172A",
                              borderRadius: 2,
                              p: 2,                     // slightly smaller padding
                              boxShadow: "0 12px 24px rgba(15,23,42,0.15)", // lighter shadow
                              maxWidth: 400,             // 🔹 narrower
                              minWidth: 120,             // 🔹 consistent smaller size
                            },
                          },
                          arrow: {
                            sx: { color: "#FFFFFF" },
                          },
                        }}
                        title={
                          latestRecord ? (
                            <Box>
                              <Typography
                                fontSize={12}         // 🔹 smaller header
                                fontWeight={700}
                                mb={0.75}
                                color="#1E293B"
                              >
                                More Details
                              </Typography>

                              <Box
                                sx={{
                                  height: 1,
                                  backgroundColor: "#E5E7EB",
                                  my: 1,              // slightly smaller spacing
                                }}
                              />

                              <Box
                                display="grid"
                                gridTemplateColumns="140px 1fr" // 🔹 slightly narrower
                                rowGap={0.75}
                                columnGap={1.5}
                              >
                                <Typography fontSize={11} color="text.secondary">
                                  Last Reviewed Date
                                </Typography>
                                <Typography fontSize={11} fontWeight={600}>
                                  {latestRecord.date}
                                </Typography>

                                <Typography fontSize={11} color="text.secondary">
                                  Reviewed By
                                </Typography>
                                <Typography fontSize={11}>{latestRecord.user}</Typography>

                                <Typography fontSize={11} color="text.secondary">
                                  Previous Status
                                </Typography>
                                <Chip
                                  label={latestRecord.status}
                                  size="small"
                                  sx={{
                                    height: 20,           // 🔹 smaller
                                    fontSize: 10,         // 🔹 smaller text
                                    fontWeight: 700,
                                    borderRadius: 999,
                                    background:
                                      latestRecord.status === "Approved"
                                        ? "linear-gradient(135deg,#34D399,#059669)"
                                        : "linear-gradient(135deg,#60A5FA,#2563EB)",
                                    color: "#fff",
                                    width: "fit-content",
                                  }}
                                />

                                <Typography fontSize={11} width={140} color="text.secondary">
                                  Previous Recon Status
                                </Typography>
                                <Typography fontSize={11}>{latestRecord.action}</Typography>

                                <Typography fontSize={11} color="text.secondary">
                                  Approver Comment
                                </Typography>
                                <Typography fontSize={11} sx={{ whiteSpace: "normal" }}>
                                  {latestRecord.remark}
                                </Typography>

                                <Typography fontSize={11} color="text.secondary">
                                  Invoice Type
                                </Typography>
                                <Typography fontSize={11} sx={{ whiteSpace: "normal" }}>
                                  {latestRecord.invoicetype}
                                </Typography>
                                <Typography fontSize={11} color="text.secondary">
                                  Is Duplicate
                                </Typography>
                                <Typography fontSize={11} sx={{ whiteSpace: "normal" }}>
                                  {latestRecord.isduplicate}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            "No audit history"
                          )
                        }
                      >
                        <IconButton
                          size="small"
                          sx={{
                            width: 24,              // 🔹 smaller
                            height: 24,             // 🔹 smaller
                            backgroundColor: "#EEF2FF",
                            padding: 0,
                            "&:hover": { backgroundColor: "#E0E7FF" },
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: 14, color: "#4338CA" }} /> {/* 🔹 smaller */}
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={auditOpen}
          onClose={() => setAuditOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
              boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: 16,
              borderBottom: "1px solid #E5E7EB",
              background: "#FFFFFF",
            }}
          >
            Audit History
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {["Last Updated Date", "Action", "Status", "Reviewed By", "Approver Comment"].map(
                      (h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: 700,
                            fontSize: 13,
                            textTransform: "uppercase",
                            color: "#475569",
                            backgroundColor: "#F8FAFC",
                          }}
                        >
                          {h}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {auditHistory.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#F1F5FF",
                        },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#4F46E5",
                            }}
                          />
                          <Typography fontSize={12} fontWeight={600}>
                            {row.date}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {row.action}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            px: 1.5,
                            borderRadius: 999,
                            background:
                              row.status === "Approved"
                                ? "linear-gradient(135deg,#34D399,#059669)"
                                : "linear-gradient(135deg,#60A5FA,#2563EB)",
                            color: "#fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={12} fontWeight={500}>
                          {row.user}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          sx={{ whiteSpace: "normal" }}
                        >
                          {row.remark}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {auditHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">
                          No audit history available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>

        {/* ================= Footer ================= */}
        <Box
          px={3}
          py={1.5}                   // slightly smaller vertical padding
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderTop="1px solid #E5E7EB"
        >
          {/* LEFT SIDE */}
          <Typography fontSize={12} color="text.secondary">
            {filteredRows.length} record(s)
          </Typography>

          {/* RIGHT SIDE – ALL BUTTONS */}
          <Box display="flex" gap={1} alignItems="center">  {/* smaller gap between buttons */}

            {/* Bulk Approve */}
            {filteredRows.length > 0 &&
              reconStatus === "Matched" &&
              status === "Pending Approval" && (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    height: 28,        // 🔹 smaller height
                    px: 2,             // 🔹 smaller padding
                    fontSize: 11,      // 🔹 smaller text
                    backgroundColor: "#005eb8",
                    "&:hover": { opacity: 0.9 },
                  }}
                  onClick={handleBulkApprove}
                >
                  Bulk Approve
                </Button>
              )}

            {/* Post to ACCPAC */}
            {filteredRows.length > 0 && status === "Approved" && (
              <Button
                variant="contained"
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  height: 28,
                  px: 2,
                  fontSize: 11,
                  backgroundColor: "#005eb8",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={handlePostOrders}
              >
                Post to ACCPAC
              </Button>
            )}

            {/* Export CSV */}
            <Button
              variant="outlined"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                height: 28,
                px: 2,
                fontSize: 11,
              }}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

      </Paper>
    </Box >
  );
};

export default Dashboard;
