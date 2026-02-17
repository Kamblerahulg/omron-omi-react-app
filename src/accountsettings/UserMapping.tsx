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
  Autocomplete,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

type RoleType = "SysAdmin" | "Reviewer" | "Approver" | "Viewer";

const ROLES: RoleType[] = ["SysAdmin", "Reviewer", "Approver", "Viewer"];

interface UserMapping {
  id: string;
  user: string;
  email: string;
  roles: RoleType[];
}

export default function UserMapping() {
  const [data, setData] = useState<UserMapping[]>([
    {
      id: "1",
      user: "Rahul Kamble",
      email: "rahul@company.com",
      roles: ["SysAdmin"],
    },
  ]);

  const emptyForm: UserMapping = {
    id: "",
    user: "",
    email: "",
    roles: [],
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserMapping | null>(null);
  const [form, setForm] = useState<UserMapping>(emptyForm);
  const dialogFieldStyle = {
    "& .MuiInputLabel-root": {
      fontSize: 11,
    },
    "& .MuiOutlinedInput-root": {
      fontSize: 12,
      height: 34,
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

  const saveMapping = () => {
    if (editing) {
      setData(prev =>
        prev.map(d => (d.id === editing.id ? form : d))
      );
    } else {
      setData(prev => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >

      {/* ===== Header ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={2}
      >
        <Typography fontSize={20} fontWeight={600}>
          User-Role Mapping
        </Typography>

        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            height: 32,
            px: 3,
            fontSize: 12,
            backgroundColor: "#005EB8",
            boxShadow: "0 4px 12px rgba(0,94,184,0.25)",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          + Add Mapping
        </Button>
      </Box>

      {/* ===== Table ===== */}
      <Paper
        sx={{
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 420,
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              width: "100%",
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                fontSize: 12,
                paddingTop: 1,
                paddingBottom: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          >

            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  fontWeight: 700,
                  fontSize: 12,
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              <TableRow>
                <TableCell sx={{ width: "25%" }}>User</TableCell>
                <TableCell sx={{ width: "35%" }}>Email</TableCell>
                <TableCell sx={{ width: "20%" }}>Roles</TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  Actions
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#F8FAFF" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>
                    {row.user}
                  </TableCell>

                  <TableCell>{row.email}</TableCell>

                  <TableCell>
                    {row.roles.join(", ")}
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1.5}>
                      <Button
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        sx={{
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
                        }}
                        onClick={() => {
                          setEditing(row);
                          setForm(row);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        startIcon={<BlockIcon sx={{ fontSize: 16 }} />}
                        sx={{
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
      </Paper>

      {/* ===== Dialog ===== */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
          {editing ? "Edit User Mapping" : "Add User Mapping"}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="User Name"
              fullWidth
              value={form.user}
              onChange={(e) =>
                setForm({ ...form, user: e.target.value })
              }
              sx={dialogFieldStyle}
            />

            <TextField
              size="small"
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              sx={dialogFieldStyle}
            />

            <Autocomplete
              multiple
              options={ROLES}
              value={form.roles}
              onChange={(_, value) =>
                setForm({ ...form, roles: value })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Roles"
                  size="small"
                  sx={dialogFieldStyle}
                />
              )}
            />
          </Stack>
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
            sx={dialogCancelBtn}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={dialogPrimaryBtn}
            onClick={saveMapping}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
