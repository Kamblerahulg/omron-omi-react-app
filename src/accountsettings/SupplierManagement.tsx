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
import { useEffect } from "react";
import { supplierService } from "../services/supplierService";

interface Supplier {
    supplier_id: string;
    supplier_name: string;
    file_type: string;
    preprocessing_required: "Y" | "N";
    pii_masking: "Y" | "N";
    master_prompt: string;
    supplier_prompt: string;
    status: "ACTIVE" | "INACTIVE";
}
const FILE_TYPES = ["CSV", "XLSX", "XML", "JSON"];
const BU = ["India", "USA", "Japan", "Germany"];
const dialogFieldStyle = {
    "& .MuiInputLabel-root": {
        fontSize: 11,
    },
    "& .MuiOutlinedInput-root": {
        fontSize: 12,
        backgroundColor: "#FFFFFF",
        "& fieldset": {
            borderColor: "#E5E7EB",
        },
    },
    "& .MuiOutlinedInput-input": {
        padding: "6px 10px",
    },
};

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
export default function SupplierManagement() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await supplierService.list();
            setSuppliers(data);
        } catch (error) {
            console.error("Failed to load suppliers:", error);
        }
    };
    const emptyForm: Supplier = {
        supplier_id: "",
        supplier_name: "",
        file_type: "",
        preprocessing_required: "N",
        pii_masking: "N",
        master_prompt: DEFAULT_PROMPT,
        supplier_prompt: "",
        status: "ACTIVE",
    };
    const deactivateSupplier = async (id: string) => {
        await supplierService.update(id, { status: "INACTIVE" });
        loadSuppliers();
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

    const saveSupplier = async () => {
        const payload = {
            supplier_id: form.supplier_id,
            supplier_name: form.supplier_name,
            file_type: form.file_type.toLowerCase(),
            preprocessing_required: form.preprocessing_required,
            pii_masking: form.pii_masking,
            master_prompt: form.master_prompt,
            supplier_prompt: form.supplier_prompt,
            status: form.status,
        };

        try {
            if (editing) {
                await supplierService.update(editing.supplier_id, payload);
            } else {
                await supplierService.create(payload);
            }
            await loadSuppliers();
            setOpen(false);
            setEditing(null);
        } catch (err) {
            console.error("API Error", err);
        }
    };
    return (
        <Box>
            {/* ===== Header ===== */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                mb={2}
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
                        setForm({
                            ...emptyForm,
                            supplier_id: Date.now().toString(),
                            master_prompt: DEFAULT_PROMPT,
                        });
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
                                {/* <TableCell sx={{ width: 150 }}>BU</TableCell> */}
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
                                    key={c.supplier_id}
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
                                        {c.supplier_name}
                                    </TableCell>

                                    {/* <TableCell>{c.bu}</TableCell> */}

                                    <TableCell>{c.file_type}</TableCell>

                                    {/* 🔥 Gradient YES/NO Chips */}
                                    <TableCell align="center">
                                        <Chip
                                            label={c.preprocessing_required}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                background:
                                                    c.preprocessing_required === "Y"
                                                        ? "linear-gradient(135deg,#34D399,#059669)"
                                                        : "linear-gradient(135deg,#F87171,#DC2626)",
                                                color: "#fff",
                                                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Chip
                                            label={c.pii_masking}
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                background:
                                                    c.pii_masking === "Y"
                                                        ? "linear-gradient(135deg,#34D399,#059669)"
                                                        : "linear-gradient(135deg,#F87171,#DC2626)",
                                                color: "#fff",
                                                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                                            }}
                                        />
                                    </TableCell>

                                    {/* 🔥 Prompt Tooltip Icon */}
                                    <TableCell align="center">
                                        <PromptTooltip title={c.master_prompt}>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)",
                                                    borderRadius: 2,
                                                    transition: "all 0.25s ease",
                                                    "&:hover": {
                                                        transform: "scale(1.1)",
                                                        boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
                                                    },
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: 16, color: "#4F46E5" }} />
                                            </IconButton>
                                        </PromptTooltip>
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
                                                onClick={async () => {
                                                    const data = await supplierService.getById(c.supplier_id); setForm(data);
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
                                                onClick={() => deactivateSupplier(c.supplier_id)}
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
                        height: "100vh",   // 🔥 reduced from 85vh
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
                    <Stack spacing={2} sx={{ mt: 1.5 }}>
                        <Box display="flex" gap={2} mb={2}>
                            <TextField
                                size="small"
                                sx={dialogFieldStyle}
                                fullWidth
                                label="Supplier Name"
                                value={form.supplier_name}
                                onChange={(e) =>
                                    setForm({ ...form, supplier_name: e.target.value })
                                }
                            />

                            <FormControl
                                fullWidth
                                size="small"
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        fontSize: 11,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        minHeight: 34,   // match Autocomplete
                                        backgroundColor: "#FFFFFF",
                                        "& fieldset": {
                                            borderColor: "#E5E7EB",
                                        },
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "6px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                <InputLabel>Invoice File Type</InputLabel>
                                <Select
                                    value={form.file_type}
                                    size="small"
                                    sx={dialogFieldStyle}
                                    onChange={(e) =>
                                        setForm({ ...form, file_type: e.target.value })
                                    }
                                    label="Invoice File Type"
                                >
                                    {FILE_TYPES.map((f) => (
                                        <MenuItem key={f} value={f.toLowerCase()}>
                                            {f}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" gap={2} mb={2}>

                            <FormControl
                                fullWidth
                                size="small"
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        fontSize: 11,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        minHeight: 34,   // match Autocomplete
                                        backgroundColor: "#FFFFFF",
                                        "& fieldset": {
                                            borderColor: "#E5E7EB",
                                        },
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "6px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                <InputLabel>Pre-Processing Flag</InputLabel>
                                <Select
                                    size="small"
                                    sx={dialogFieldStyle}
                                    value={form.preprocessing_required}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            preprocessing_required:
                                                e.target.value as "Y" | "N",
                                        })
                                    }
                                    label="Pre-Processing Flag"
                                >
                                    <MenuItem value="Y">Yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl
                                fullWidth
                                size="small"
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        fontSize: 11,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        minHeight: 34,   // match Autocomplete
                                        backgroundColor: "#FFFFFF",
                                        "& fieldset": {
                                            borderColor: "#E5E7EB",
                                        },
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "6px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                }}
                            >
                                <InputLabel>PII Masking Flag</InputLabel>
                                <Select
                                    value={form.pii_masking}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            pii_masking: e.target.value as "Y" | "N",
                                        })
                                    }
                                    label="PII Masking Flag"
                                >
                                    <MenuItem value="Y">Yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </Select>
                            </FormControl>

                        </Box>

                        <TextField
                            label="Master Prompt"
                            multiline
                            value={form.master_prompt}
                            onChange={e =>
                                setForm({ ...form, master_prompt: e.target.value })
                            }
                            minRows={4}
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
                        <TextField
                            label="Supplier Prompt"
                            multiline
                            value={form.supplier_prompt}
                            onChange={e =>
                                setForm({ ...form, supplier_prompt: e.target.value })
                            }
                            minRows={6}
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
                    <Button variant="outlined"
                        size="small"
                        sx={dialogCancelBtn}
                        onClick={() => setOpen(false)}>Cancel
                    </Button>
                    <Button variant="contained" sx={dialogPrimaryBtn}
                        onClick={saveSupplier}>
                        Save
                    </Button>
                </DialogActions>

            </Dialog>
        </Box>
    );
}

const PromptTooltip = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactElement;
}) => {
    return (
        <Tooltip
            arrow
            placement="left"
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: "preventOverflow",
                            options: {
                                boundary: "viewport",
                                padding: 12,
                            },
                        },
                    ],
                },
                tooltip: {
                    sx: {
                        background: "linear-gradient(135deg,#F8FAFC,#EEF2F7)",
                        color: "#1E293B",
                        borderRadius: 3,
                        p: 2,
                        boxShadow: "0 20px 60px rgba(15,23,42,0.15)",
                        border: "1px solid #E2E8F0",
                        backdropFilter: "blur(6px)",
                        maxWidth: 600,
                    },
                },
                arrow: {
                    sx: {
                        color: "#EEF2F7",
                    },
                },
            }}
            title={
                <Box
                    sx={{
                        maxHeight: 280,
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: 13,
                        lineHeight: 1.7,
                        fontFamily: "monospace",
                    }}
                >
                    {title || "No prompt available"}
                </Box>
            }
        >
            {children}
        </Tooltip>
    );
};

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

