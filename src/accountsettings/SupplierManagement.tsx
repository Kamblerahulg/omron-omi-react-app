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
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import { DEFAULT_PROMPT } from "../config/prompts/defaultPrompts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

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
            <Typography fontSize={22} fontWeight={600} mb={1}>
                Supplier Management
            </Typography>

            <Paper sx={{ borderRadius: 4, mt: 2 }}>
                <Box px={3} py={1} display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}></Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setEditing(null);
                            setForm({
                                ...emptyForm,
                                prompt: DEFAULT_PROMPT, // ✅ preload
                            });
                            setOpen(true);
                        }}
                    >
                        Add Supplier
                    </Button>

                </Box>

                <TableContainer>
                    <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                        <colgroup>
                            <col style={{ width: "16%" }} />  {/* Supplier */}
                            <col style={{ width: "10%" }} />  {/* BU */}
                            <col style={{ width: "12%" }} />  {/* File Type */}
                            <col style={{ width: "12%" }} />  {/* Pre */}
                            <col style={{ width: "12%" }} />  {/* PII */}
                            <col style={{ width: "18%" }} />  {/* Prompt */}
                            <col style={{ width: "20%" }} />  {/* Actions */}
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Supplier</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>BU</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>File Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Pre-Processing</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>PII Masking</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 15, textAlign: "center" }}>
                                    Prompt
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: 15,
                                        whiteSpace: "nowrap",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {suppliers.map(c => (
                                <TableRow key={c.id} hover>
                                    <TableCell sx={{ fontSize: 15 }}>{c.name}</TableCell>
                                    <TableCell sx={{ fontSize: 15 }}>{c.bu}</TableCell>
                                    <TableCell sx={{ fontSize: 15 }}>
                                        {c.fileType}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: 15 }}>
                                        {c.preProcessing}
                                    </TableCell>

                                    <TableCell sx={{ fontSize: 15 }}>
                                        {c.piiMasking}
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
                                                        p: 2,
                                                        boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
                                                        maxWidth: 520,
                                                    },
                                                },
                                                arrow: {
                                                    sx: { color: "#FFFFFF" },
                                                },
                                            }}
                                            title={
                                                <Box>
                                                    <Typography
                                                        fontSize={13}
                                                        fontWeight={700}
                                                        mb={1}
                                                        color="#1E293B"
                                                    >
                                                        Prompt
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            fontSize: 13,
                                                            lineHeight: 1.6,
                                                            fontFamily: "monospace",
                                                            backgroundColor: "#F8FAFC",
                                                            borderRadius: 1.5,
                                                            p: 1.5,
                                                            maxHeight: 260,
                                                            overflowY: "auto",
                                                            whiteSpace: "pre-wrap",
                                                        }}
                                                    >
                                                        {c.prompt || "No prompt configured"}
                                                    </Box>
                                                </Box>
                                            }
                                        >
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
                                                <VisibilityIcon sx={{ color: "#4338CA" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            paddingLeft: 0,
                                            paddingRight: 0,
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1.5}
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{ minWidth: 140 }}   // 🔥 SAME AS USER MAPPING
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={0.8}
                                                alignItems="center"
                                                sx={actionStyle("#2563EB")}
                                                onClick={() => {
                                                    setEditing(c);
                                                    setForm({
                                                        ...c,
                                                        prompt: c.prompt || DEFAULT_PROMPT,
                                                    });
                                                    setOpen(true);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                                <Typography fontSize={15}>Edit</Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={0.8}
                                                alignItems="center"
                                                sx={actionStyle("#DC2626")}
                                            >
                                                <BlockIcon fontSize="small" />
                                                <Typography fontSize={15}>Deactivate</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="lg" // ✅ BIG
                PaperProps={{
                    sx: {
                        height: "85vh",
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
                            minRows={14}
                            maxRows={18}
                            fullWidth
                            sx={{
                                "& .MuiInputBase-root": {
                                    fontFamily: "monospace",
                                    fontSize: 15,
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
