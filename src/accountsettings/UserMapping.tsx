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
type GroupType = "SG_CS" | "VN_CS" | "ID_CS";
type EntityType = "Finance" | "HR" | "IT" | "Operations";

const ROLES: RoleType[] = ["SysAdmin", "Reviewer", "Approver", "Viewer"];
const GROUPS: GroupType[] = ["SG_CS", "VN_CS", "ID_CS"];
const ENTITIES: EntityType[] = ["Finance", "HR", "IT", "Operations"];

interface UserMapping {
  id: string;
  user: string;
  email: string;
  roles: RoleType[];
  groups: GroupType[];
  entity: EntityType | "";
}

export default function UserMapping() {
  const [data, setData] = useState<UserMapping[]>([
    {
      id: "1",
      user: "Rahul Kamble",
      email: "rahul@company.com",
      roles: ["SysAdmin"],
      groups: ["VN_CS", "ID_CS"],
      entity: "Finance", // Added default entity
    },
  ]);

  const emptyForm: UserMapping = {
    id: "",
    user: "",
    email: "",
    roles: [],
    groups: [],
    entity: "",
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserMapping | null>(null);
  const [form, setForm] = useState<UserMapping>(emptyForm);

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
    <Box>
      <Typography fontSize={22} fontWeight={600} mb={1}>
        User-Role Mapping
      </Typography>

      <Paper sx={{ borderRadius: 4, mt: 2 }}>
        <Box px={3} py={1} display="flex" justifyContent="space-between">
          <Typography fontWeight={600}></Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Mapping
          </Button>
        </Box>

        <TableContainer sx={{ overflowX: "hidden" }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Roles</TableCell>
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
              {data.map(row => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontSize: 15 }}>{row.user}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell sx={{ fontSize: 15 }}>{row.roles.join(", ")}</TableCell>
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
                      sx={{ minWidth: 140 }}
                    >
                      {/* Edit */}
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={actionStyle("#2563EB")}
                        onClick={() => {
                          setEditing(row);
                          setForm(row);
                          setOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                        <Typography fontSize={15}>Edit</Typography>
                      </Stack>

                      {/* Delete */}
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
        <DialogTitle>{editing ? "Edit User Mapping" : "Add User Mapping"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="User Name"
              value={form.user}
              onChange={e => setForm({ ...form, user: e.target.value })}
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            {/* Roles */}
            <Autocomplete
              multiple
              options={ROLES}
              value={form.roles}
              onChange={(_, value) => setForm({ ...form, roles: value })}
              renderInput={params => <TextField {...params} label="Roles" />}
            />
         
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveMapping}>
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
  "&:hover": { backgroundColor: `${color}26` },
});
