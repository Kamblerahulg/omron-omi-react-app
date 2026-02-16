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
  OutlinedInput,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

interface Role {
  id: string;
  name: string;
  status: string;
  permissions: string[];
}

const PERMISSIONS = [
  "View Dashboard",
  "Create Order",
  "Approve Order",
  "Reject Order",
  "Manage Users",
  "Manage Configuration",
];

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "SysAdmin",
      status: "Active",
      permissions: ["Manage Users", "Manage Configuration"],
    },
  ]);

  const emptyForm: Role = {
    id: "",
    name: "",
    status: "Active", // ✅ default
    permissions: [],
  };


  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState<Role>(emptyForm);

  const saveRole = () => {
    if (editing) {
      setRoles(prev =>
        prev.map(r => (r.id === editing.id ? form : r))
      );
    } else {
      setRoles(prev => [
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
        Role Management
      </Typography>

      <Paper sx={{ borderRadius: 4, mt: 2 }}>
        <Box px={3} py={1} display="flex" justifyContent="space-between">
          <Typography fontWeight={600}></Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Role
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ tableLayout: "fixed" }}>
            {/* 🔒 Lock column widths */}
            <colgroup>
              <col style={{ width: "38%" }} />  {/* Role */}
              <col style={{ width: "38%" }} />  {/* Role */}
              <col style={{ width: "24%" }} />  {/* Actions */}
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 15 }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: 15 }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    px: 0,              // 🔒 critical
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell sx={{ fontSize: 15 }}>
                    {role.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor:
                          role.status === "Active" ? "#ECFDF5" : "#FEF2F2",
                        color:
                          role.status === "Active" ? "#047857" : "#B91C1C",
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      px: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        minWidth: 140,
                        mx: "auto",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={actionStyle("#2563EB")}
                        onClick={() => {
                          setEditing(role);
                          setForm(role);
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editing ? "Edit Role" : "Add Role"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Role Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Deactive">Deactive</MenuItem>
              </Select>
            </FormControl>

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveRole}>
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
