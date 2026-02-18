import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    TableContainer,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { DEFAULT_PROMPT } from "../config/prompts/defaultPrompts";

interface Supplier {
    id: string;
    name: string;
    bu: string;
    fileType: string;
    preProcessing: "Y" | "N";
    piiMasking: "Y" | "N";
    prompt: string;
}

const FILE_TYPES = ["CSV", "XLSX", "XML", "JSON"];
const BU = ["India", "USA", "Japan", "Germany"];

export default function SupplierManagement() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        {
            id: "1",
            name: "Omron",
            bu: "India",
            fileType: "CSV",
            preProcessing: "Y",
            piiMasking: "N",
            prompt: "Validate SO before ingestion",
        },
    ]);

    const emptyForm: Supplier = {
        id: "",
        name: "",
        bu: "",
        fileType: "",
        preProcessing: "N",
        piiMasking: "N",
        prompt: "",
    };

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [form, setForm] = useState<Supplier>(emptyForm);
    const headerButton = {
        borderRadius: 999,
        textTransform: "none",
        fontWeight: 600,
        height: 32,
        px: 3,
        fontSize: 12,
        backgroundColor: "#005EB8",
        boxShadow: "0 4px 12px rgba(0,94,184,0.25)",
        "&:hover": { opacity: 0.9 },
    };
    const chipStyle = (isYes: boolean) => ({
        height: 20,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 999,
        background: isYes ? "#DCFCE7" : "#FEE2E2",
        color: isYes ? "#166534" : "#991B1B",
    });
    const editBtn = {
        textTransform: "none",
        fontSize: 12,
        height: 28,
        minWidth: "auto",
        px: 1.5,
        borderRadius: 999,
        fontWeight: 600,
        color: "#2563EB",
        backgroundColor: "#EFF6FF",
        "&:hover": { backgroundColor: "#DBEAFE" },
    };
    const deactivateBtn = {
        textTransform: "none",
        fontSize: 12,
        height: 28,
        minWidth: "auto",
        px: 1.5,
        borderRadius: 999,
        fontWeight: 600,
        color: "#DC2626",
        backgroundColor: "#FEF2F2",
        "&:hover": { backgroundColor: "#FEE2E2" },
    };

    const saveSupplier = () => {
        if (editing) {
            setSuppliers(prev =>
                prev.map(c => (c.id === editing.id ? form : c))
            );
        } else {
            setSuppliers(prev => [
                ...prev,
                { ...form, id: Date.now().toString() },
            ]);
        }
        setOpen(false);
        setEditing(null);
        setForm(emptyForm);
    };

    return (
        <Box>
            {/* ===== Header ===== */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                mb={0}
            >
                <Typography fontSize={20} fontWeight={600}>
                    Supplier Management
                </Typography>

                <Button
                    variant="contained"
                    size="small"
                    sx={headerButton}
                    onClick={() => {
                        setEditing(null);
                        setForm({ ...emptyForm, prompt: DEFAULT_PROMPT });
                        setOpen(true);
                    }}
                >
                    + Add Supplier
                </Button>
            </Box>

            {/* ===== Table ===== */}
            <Paper
                sx={{
                    flex: 1,
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
                            tableLayout: "auto",
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
                        {/* ================= HEADER ================= */}
                        <TableHead
                            sx={{
                                "& .MuiTableCell-root": {
                                    fontWeight: 600,
                                    fontSize: 12,
                                    backgroundColor: "#F9FAFB",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ width: 200 }}>Supplier</TableCell>
                                <TableCell sx={{ width: 150 }}>BU</TableCell>
                                <TableCell sx={{ width: 140 }}>File Type</TableCell>
                                <TableCell align="center" sx={{ width: 160 }}>
                                    Pre Processing
                                </TableCell>
                                <TableCell align="center" sx={{ width: 150 }}>
                                    PII Masking
                                </TableCell>
                                <TableCell align="center" sx={{ width: 120 }}>
                                    Prompt
                                </TableCell>
                                <TableCell align="center" sx={{ width: 200 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        {/* ================= BODY ================= */}
                        <TableBody>
                            {suppliers.map((c) => (
                                <TableRow
                                    key={c.id}
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
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {c.name}
                                    </TableCell>

                                    <TableCell>{c.bu}</TableCell>

                                    <TableCell>{c.fileType}</TableCell>

                                    {/* 🔥 Gradient YES/NO Chips */}
                                    <TableCell align="center">
                                        <Chip
                                            label={c.preProcessing}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                background:
                                                    c.preProcessing === "Y"
                                                        ? "linear-gradient(135deg,#34D399,#059669)"
                                                        : "linear-gradient(135deg,#F87171,#DC2626)",
                                                color: "#fff",
                                                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Chip
                                            label={c.piiMasking}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                background:
                                                    c.piiMasking === "Y"
                                                        ? "linear-gradient(135deg,#34D399,#059669)"
                                                        : "linear-gradient(135deg,#F87171,#DC2626)",
                                                color: "#fff",
                                                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                                            }}
                                        />
                                    </TableCell>

                                    {/* 🔥 Prompt Tooltip Icon */}
                                    <TableCell align="center">
                                        <Tooltip title="View Prompt" arrow>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#EEF2FF",
                                                    "&:hover": {
                                                        backgroundColor: "#E0E7FF",
                                                        transform: "scale(1.1)",
                                                    },
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: 16, color: "#4338CA" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>

                                    {/* 🔥 Compact Action Buttons */}
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Button
                                                size="small"
                                                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                                sx={{
                                                    textTransform: "none",
                                                    fontSize: 11,
                                                    height: 26,
                                                    minWidth: 80,
                                                    borderRadius: 999,
                                                    fontWeight: 600,
                                                    color: "#2563EB",
                                                    backgroundColor: "#EFF6FF",
                                                    "&:hover": { backgroundColor: "#DBEAFE" },
                                                }}
                                                onClick={() => {
                                                    setEditing(c);
                                                    setForm({
                                                        ...c,
                                                        prompt: c.prompt || DEFAULT_PROMPT,
                                                    });
                                                    setOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="small"
                                                startIcon={<BlockIcon sx={{ fontSize: 14 }} />}
                                                sx={{
                                                    textTransform: "none",
                                                    fontSize: 11,
                                                    height: 26,
                                                    minWidth: 95,
                                                    borderRadius: 999,
                                                    fontWeight: 600,
                                                    color: "#DC2626",
                                                    backgroundColor: "#FEF2F2",
                                                    "&:hover": { backgroundColor: "#FEE2E2" },
                                                }}
                                            >
                                                Deactivate
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* ================= FOOTER ================= */}
                <Box
                    px={3}
                    py={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderTop="1px solid #E5E7EB"
                >
                    <Typography fontSize={12} color="text.secondary">
                        {suppliers.length} record(s)
                    </Typography>
                </Box>
            </Paper>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"   // 🔥 reduced from lg → md
                PaperProps={{
                    sx: {
                        height: "70vh",   // 🔥 reduced from 85vh
                        borderRadius: 4,
                        boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        fontSize: 20,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        background: "#fff",
                        borderBottom: "1px solid #E5E7EB",
                    }}
                >
                    {editing ? "Edit Supplier" : "Add Supplier"}
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Supplier Name"
                            value={form.name}
                            onChange={e =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <FormControl>
                            <InputLabel>BU</InputLabel>
                            <Select
                                value={form.bu}
                                onChange={e =>
                                    setForm({ ...form, bu: e.target.value })
                                }
                                label="BU"
                            >
                                {BU.map(c => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Inoice File Type</InputLabel>
                            <Select
                                value={form.fileType}
                                onChange={e =>
                                    setForm({ ...form, fileType: e.target.value })
                                }
                                label="Invoice File Type"
                            >
                                {FILE_TYPES.map(f => (
                                    <MenuItem key={f} value={f}>
                                        {f}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Pre-Processing Flag</InputLabel>
                            <Select
                                value={form.preProcessing}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        preProcessing: e.target.value as "Y" | "N",
                                    })
                                }
                                label="Pre-Processing Flag"
                            >
                                <MenuItem value="Y">Yes</MenuItem>
                                <MenuItem value="N">No</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>PII Masking Flag</InputLabel>
                            <Select
                                value={form.piiMasking}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        piiMasking: e.target.value as "Y" | "N",
                                    })
                                }
                                label="PII Masking Flag"
                            >
                                <MenuItem value="Y">Yes</MenuItem>
                                <MenuItem value="N">No</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Prompt Template"
                            multiline
                            value={form.prompt}
                            onChange={e => setForm({ ...form, prompt: e.target.value })}
                            minRows={8}      // 🔥 reduced from 14
                            maxRows={12}     // 🔥 reduced from 18
                            fullWidth
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontFamily: "monospace",
                                    fontSize: 14,   // 🔥 slightly smaller
                                    lineHeight: 1.6,
                                    backgroundColor: "#fffbfb",
                                    borderRadius: 2,
                                },
                                "& textarea": {
                                    scrollbarWidth: "thin",
                                },
                                "& label": {
                                    color: "#475569",
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        background: "#fff",
                        borderTop: "1px solid #E5E7EB",
                        px: 3,
                        py: 2,
                    }}
                >
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={saveSupplier}>
                        Save
                    </Button>
                </DialogActions>

            </Dialog>
        </Box>
    );
}

/* ===== Reusable Action Style ===== */
const actionStyle = (color: string) => ({
    px: 1,
    py: 0.4,
    borderRadius: 1.2,
    cursor: "pointer",
    color,
    fontSize: 14,
    backgroundColor: `${color}14`,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    "& svg": { fontSize: 18 },
    "&:hover": {
        backgroundColor: `${color}26`,
    },
});

