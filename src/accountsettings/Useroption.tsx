import React, { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, TableContainer,
  Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

type UserState = "Created" | "Active" | "Inactive" | "Suspended";

interface User {
  id: string;
  name: string;
  email: string;
  status: UserState;
  active: boolean;
}

const STATUS: UserState[] = ["Created", "Active", "Inactive", "Suspended"];

export default function UserOption() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Rahul Kamble",
      email: "rahul@company.com",
      status: "Active",
      active: true,
    },
  ]);

  const emptyUser: User = {
    id: "",
    name: "",
    email: "",
    status: "Created",
    active: true,
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<User>(emptyUser);

  const saveUser = () => {
    if (editing) {
      setUsers(prev => prev.map(u => (u.id === editing.id ? form : u)));
    } else {
      setUsers(prev => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyUser);
  };

  return (
    <Box>

      {/* ===== Top Header Row ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={0}
      >
        <Typography
          fontFamily={`"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`}
          fontSize={18}
          fontWeight={600}
          mb={1}
        >
          User Options
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
            setForm(emptyUser);
            setOpen(true);
          }}
        >
          + Add User
        </Button>
      </Box>

      {/* ===== Table Card ===== */}
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
              tableLayout: "auto", // ✅ auto fit like first table
              "& .MuiTableCell-root": {
                fontSize: 11,                 // 🔥 same as first table
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
                  fontWeight: 600,            // 🔥 match first table
                  fontSize: 12,
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              <TableRow>
                <TableCell sx={{ width: 220 }}>Name</TableCell>
                <TableCell sx={{ width: 260 }}>Email</TableCell>
                <TableCell align="center" sx={{ width: 150 }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ width: 220 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ================= BODY ================= */}
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
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
                    {u.name}
                  </TableCell>

                  <TableCell>{u.email}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={u.status}
                      size="small"
                      sx={{
                        height: 18,             // 🔥 compact like first table
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 999,
                        background:
                          u.status === "Active"
                            ? "linear-gradient(135deg,#34D399,#059669)"
                            : u.status === "Inactive"
                              ? "linear-gradient(135deg,#F87171,#DC2626)"
                              : u.status === "Suspended"
                                ? "linear-gradient(135deg,#FBBF24,#D97706)"
                                : "linear-gradient(135deg,#60A5FA,#2563EB)",
                        color: "#fff",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                      }}
                    />
                  </TableCell>

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
                          setEditing(u);
                          setForm(u);
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
            {users.length} record(s)
          </Typography>
        </Box>
      </Paper>


      {/* Dialog */}
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
        {/* ===== Header ===== */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 15,
            borderBottom: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          {editing ? "Edit User" : "Add User"}
        </DialogTitle>

        {/* ===== Content ===== */}
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
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

            <FormControl size="small" fullWidth sx={dialogFieldStyle}>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as UserState,
                  })
                }
              >
                {STATUS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        {/* ===== Footer ===== */}
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
            onClick={saveUser}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
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

const headerStyle = {
  fontWeight: 600,
  fontSize: 14,
  py: 1,
};

const cellStyle = {
  fontSize: 14,
  py: 1,
};

const actionStyle = (color: string) => ({
  px: 1,
  py: 0.3,
  borderRadius: 1,
  cursor: "pointer",
  color,
  fontSize: 13,
  backgroundColor: `${color}14`,
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  "& svg": { fontSize: 16 },
  "&:hover": {
    backgroundColor: `${color}26`,
  },
});
