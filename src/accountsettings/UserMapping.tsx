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
import { useEffect } from "react";
import { userRoleService } from "../services/userRole.service";
import { userService } from "../services/user.service";
import { roleService, Role } from "../services/role.service";

interface UserMapping {
  id: string;
  user: string;
  email: string;
  roles: Role[];
}

export default function UserMapping() {
  const [data, setData] = useState<UserMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const usersResponse = await userService.list();
        setUsersList(usersResponse);

        const rolesResponse = await userRoleService.list();
        const roleMaster = await roleService.list();
        setRolesList(roleMaster);

        const normalized = rolesResponse.map((item) => {
          const matchedUser = usersResponse.find(
            (u) => u.user_id === item.user_id
          );

          const matchedRole = roleMaster.find(
            (r) => r.role_id === item.role_id
          );

          return {
            id: item.user_role_id,
            user: item.user_id,
            email: matchedUser?.email || "",
            roles: matchedRole ? [matchedRole] : [],
          };
        });

        setData(normalized);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

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

  const saveMapping = async () => {
    try {
      if (!form.user || form.roles.length === 0) return;

      const roleId = form.roles[0]?.role_id;
      if (editing) {
        await userRoleService.update(editing.id, {
          user_id: form.user,
          role_id: roleId,
        });
      } else {
        const response = await userRoleService.create({
          user_role_id: Date.now(),
          user_id: form.user,
          role_id: roleId,
        });

        if (!response?.user_role_id) {
          throw new Error("Create failed");
        }
      }

      // 🔥 Refresh after save
      const rolesResponse = await userRoleService.list();
      const roleMaster = await roleService.list();

      const normalized = rolesResponse.map((item) => {
        const matchedUser = usersList.find(
          (u) => u.user_id === item.user_id
        );

        const matchedRole = roleMaster.find(
          (r) => r.role_id === item.role_id
        );

        return {
          id: item.user_role_id,
          user: item.user_id,
          email: matchedUser?.email || "",
          roles: matchedRole ? [matchedRole] : [],
        };
      });

      setData(normalized);

      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      console.error("Save mapping failed", error);
    }
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
        <Typography
          fontFamily={`"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`}
          fontSize={18}
          fontWeight={600}
          mb={1}
        >
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
                <TableCell sx={{ width: 220 }}>User</TableCell>
                <TableCell sx={{ width: 260 }}>Email</TableCell>
                <TableCell sx={{ width: 220 }}>Roles</TableCell>
                <TableCell align="center" sx={{ width: 200 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ================= BODY ================= */}
            <TableBody>
              {data.map((row) => (
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
                  <TableCell sx={{ fontWeight: 500 }}>
                    {usersList.find((u) => u.user_id === row.user)?.username || row.user}
                  </TableCell>

                  <TableCell>{row.email}</TableCell>

                  {/* 🔥 Roles as gradient chips instead of plain text */}
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {row.roles.map((role) => (
                        <Box
                          key={role.role_id}
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            px: 1.2,
                            py: 0.3,
                            borderRadius: 999,
                            color: "#fff",
                            background:
                              role.role_name === "SysAdmin"
                                ? "linear-gradient(135deg,#7C3AED,#5B21B6)"
                                : role.role_name === "Reviewer"
                                  ? "linear-gradient(135deg,#60A5FA,#2563EB)"
                                  : role.role_name === "Approver"
                                    ? "linear-gradient(135deg,#34D399,#059669)"
                                    : "linear-gradient(135deg,#FBBF24,#D97706)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                          }}
                        >
                          {role.role_name}
                        </Box>
                      ))}
                    </Box>
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
                          setEditing(row);
                          setForm(row);
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
            {data.length} record(s)
          </Typography>
        </Box>
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
          <Stack spacing={2} sx={{ mt: 1.5 }}>
            <Autocomplete
              options={usersList}
              getOptionLabel={(option) => option.username}
              value={
                usersList.find((u) => u.user_id === form.user) || null
              }
              onChange={(_, value) => {
                setForm({
                  ...form,
                  user: value?.user_id || "",
                  email: value?.email || "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User"
                  size="small"
                  sx={dialogFieldStyle}
                />
              )}
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
              options={rolesList}
              getOptionLabel={(option) => option.role_name}
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
