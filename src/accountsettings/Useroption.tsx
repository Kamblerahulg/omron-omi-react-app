import React, { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Stack, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, TableContainer
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
      <Typography fontSize={22} fontWeight={600} mb={1}>
        User Options
      </Typography>

      <Paper sx={{ borderRadius: 4, mt: 2 }}>
        <Box px={3} py={1} display="flex" justifyContent="space-between">
          <Typography fontWeight={600}></Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add User
          </Button>
        </Box>

        <TableContainer sx={{ overflowX: "hidden" }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "30%" }} />  {/* Name */}
              <col style={{ width: "26%" }} />  {/* Email */}
              <col style={{ width: "19%" }} />  {/* Status */}
              <col style={{ width: "20%" }} />  {/* Actions */}
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 15 }}>Status</TableCell>
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
              {users.map(u => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontSize: 15 }}>{u.name}</TableCell>
                  <TableCell sx={{ fontSize: 15 }}>{u.email}</TableCell>
                  <TableCell sx={{ fontSize: 15 }}>
                    {u.status}
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
                      sx={{ minWidth: 140 }}   // 🔥 SAME
                    >
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={actionStyle("#2563EB")}
                        onClick={() => {
                          setEditing(u);
                          setForm(u);
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
        <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <TextField label="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as UserState })}>
                {STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveUser}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
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
