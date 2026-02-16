import React, { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    Stack,
    TableContainer,
    FormControl,
    InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

type UserState = "Created" | "Active" | "Inactive" | "Suspended";
type RoleType = "SysAdmin" | "Reviewer" | "Approver" | "Viewer";

interface User {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    state: UserState;
    active: boolean;
    primaryCustomerService?: string;
    secondaryCustomerService?: string;
}

type Role = { id: string; name: RoleType; active: boolean };
type Group = { id: string; name: string; active: boolean };
type CustomerService = { id: string; name: string; groupIds: string[] };

const ROLES: RoleType[] = ["SysAdmin", "Reviewer", "Approver", "Viewer"];
const STATES: UserState[] = ["Created", "Active", "Inactive", "Suspended"];

export default function AccountSettings() {
    const [tab, setTab] = useState(0);
    const deleteActionStyle = {
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.4,
        py: 0.6,
        borderRadius: 1.5,
        cursor: "pointer",

        border: "1px solid rgba(220, 38, 38, 0.25)",
        color: "#DC2626",
        backgroundColor: "transparent",

        transition: "all 0.2s ease",

        "&:hover": {
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            borderColor: "#DC2626",
        },
    };

    const editActionStyle = {
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.4,
        py: 0.6,
        borderRadius: 1.5,
        cursor: "pointer",

        border: "1px solid rgba(47, 111, 237, 0.25)", // 🔹 faint border
        color: "#2F6FED",
        backgroundColor: "transparent",

        transition: "all 0.2s ease",

        "&:hover": {
            backgroundColor: "rgba(47, 111, 237, 0.08)",
            borderColor: "#2F6FED",
        },
    };

    /* ===== USERS ===== */
    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            name: "Rahul Kamble",
            email: "rahul@company.com",
            role: "SysAdmin",
            state: "Active",
            active: true,
        },
    ]);
    const [openUser, setOpenUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    /* ===== ROLES ===== */
    const [roles, setRoles] = useState<Role[]>([
        { id: "1", name: "SysAdmin", active: true },
    ]);
    const [openRole, setOpenRole] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleName, setRoleName] = useState<RoleType>("Viewer");
    const saveRole = () => {
        if (editingRole) {
            setRoles(prev =>
                prev.map(r => (r.id === editingRole.id ? roleForm : r))
            );
        } else {
            setRoles(prev => [...prev, { ...roleForm, id: Date.now().toString() }]);
        }

        setOpenRole(false);
        setEditingRole(null);
        setRoleForm(emptyRole);
    };

    /* ===== GROUPS ===== */
    const [groups, setGroups] = useState<Group[]>([
        { id: "1", name: "Finance", active: true },
        { id: "2", name: "Loan", active: true }
    ]);
    const [groupName, setGroupName] = useState("");
    const emptyGroup: Group = { id: "", name: "", active: true };
    const [groupForm, setGroupForm] = useState<Group>(emptyGroup);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [openGroup, setOpenGroup] = useState(false);

    /* ===== CUSTOMER SERVICES ===== */
    const [customerServices, setCustomerServices] = useState<CustomerService[]>([
        { id: "1", name: "Billing", groupIds: ["1"] },
    ]);
    const [openCS, setOpenCS] = useState(false);
    const [csName, setCsName] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const emptyCS: CustomerService = { id: "", name: "", groupIds: [] };
    const [csForm, setCsForm] = useState<CustomerService>(emptyCS);
    const [editingCS, setEditingCS] = useState<CustomerService | null>(null);

    /* ================= SAVE HANDLERS ================= */
    const saveUser = () => {
        if (editingUser) {
            setUsers((prev) =>
                prev.map((u) => (u.id === editingUser.id ? userForm : u))
            );
        } else {
            setUsers((prev) => [
                ...prev,
                { ...userForm, id: Date.now().toString() },
            ]);
        }

        setOpenUser(false);
        setEditingUser(null);
    };

    const emptyRole: Role = { id: "", name: "Viewer", active: true };
    const [roleForm, setRoleForm] = useState<Role>(emptyRole);

    const saveGroup = () => {
        if (editingGroup) {
            setGroups(prev =>
                prev.map(g => (g.id === editingGroup.id ? groupForm : g))
            );
        } else {
            setGroups(prev => [...prev, { ...groupForm, id: Date.now().toString() }]);
        }

        setOpenGroup(false);
        setEditingGroup(null);
        setGroupForm(emptyGroup);
    };
    const saveCS = () => {
        if (editingCS) {
            setCustomerServices(prev =>
                prev.map(cs => (cs.id === editingCS.id ? csForm : cs))
            );
        } else {
            setCustomerServices(prev => [
                ...prev,
                { ...csForm, id: Date.now().toString() },
            ]);
        }

        setOpenCS(false);
        setEditingCS(null);
        setCsForm(emptyCS);
    };
    /* ================= STYLES ================= */
    const tablePaperStyles = {
        borderRadius: 4,
        border: "1px solid #fff",
        mt: 3,
    };
    const emptyUser: User = {
        id: "",
        name: "",
        email: "",
        role: "Viewer",
        state: "Created",
        active: true,
        primaryCustomerService: "",
        secondaryCustomerService: "",
    };

    const [userForm, setUserForm] = useState<User>(emptyUser);

    const headerCellStyles = {
        fontWeight: 600,
        fontSize: 16,
        backgroundColor: "#F9FAFB",
    };

    const chipActive = { backgroundColor: "#ECFDF5", color: "#047857" };
    const chipInactive = { backgroundColor: "#EFF6FF", color: "#1D4ED8" };

    const gradientButton = {
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        px: 3,
        background: "linear-gradient(135deg, #2F6FED, #2F6FED)",
        color: "#fff", // ✅ sets the button text color
        "&:hover": {
            background: "linear-gradient(135deg, #1D4ED8, #1D4ED8)", // slightly darker on hover
        },
    };


    return (
        <Box p={0}>
            <Typography fontSize={22} fontWeight={600} mb={1}>
                Account Configuration
            </Typography>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                TabIndicatorProps={{
                    sx: {
                        height: 3,
                        borderRadius: 999,
                        background:
                            "linear-gradient(90deg, #2F6FED, #60A5FA)",
                        transition: "all 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    },
                }}
                sx={{
                    mb: 1,
                    px: 1,
                    minHeight: 56,
                    backdropFilter: "blur(6px)",
                    // background: "rgba(255,255,255,0.6)",
                    borderRadius: 3,

                    "& .MuiTabs-flexContainer": {
                        gap: 2,
                    },
                }}
            >
                {["Users", "Roles", "Groups", "Customer Services"].map((label) => (
                    <Tab
                        key={label}
                        label={label}
                        disableRipple
                        sx={{
                            textTransform: "none",
                            fontSize: 17,
                            fontWeight: 500,
                            letterSpacing: "0.4px",
                            minHeight: 48,
                            px: 3,
                            borderRadius: 2,

                            color: "#6B7280",
                            transition: "all 0.35s ease",

                            "&:hover": {
                                color: "#1F2937",
                                backgroundColor: "rgba(0,0,0,0.03)",
                            },

                            "&.Mui-selected": {
                                color: "#0F172A",
                                fontWeight: 600,
                                background:
                                    "linear-gradient(180deg, rgba(47,111,237,0.12), rgba(47,111,237,0.04))",
                                backdropFilter: "blur(8px)",
                            },
                        }}
                    />
                ))}
            </Tabs>

            {/* ===== USERS ===== */}
            {tab === 0 && (
                <Paper sx={tablePaperStyles}>
                    <Box px={3} py={1} display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Users</Typography>
                        <Button
                            sx={gradientButton}
                            onClick={() => {
                                setEditingUser(null);
                                setUserForm(emptyUser);
                                setOpenUser(true);
                            }}
                        >
                            Add User
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Name</TableCell>
                                    <TableCell sx={headerCellStyles}>Email</TableCell>
                                    <TableCell sx={headerCellStyles}>Role</TableCell>
                                    <TableCell sx={headerCellStyles}>State</TableCell>
                                    <TableCell sx={headerCellStyles}>Status</TableCell>

                                    {/* Common Actions header */}
                                    <TableCell
                                        sx={{
                                            ...headerCellStyles,
                                            textAlign: "center",
                                            width: 240,
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        hover
                                        sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}
                                    >
                                        <TableCell sx={{ fontSize: 15 }}>{u.name}</TableCell>
                                        <TableCell sx={{ fontSize: 15 }}>{u.email}</TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>
                                            <Chip
                                                label={u.role}
                                                size="small"
                                                sx={u.active ? chipActive : chipInactive}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>{u.state}</TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>
                                            <Chip
                                                label={u.active ? "Active" : "Inactive"}
                                                size="small"
                                                sx={u.active ? chipActive : chipInactive}
                                            />
                                        </TableCell>

                                        {/* Actions Cell */}
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {/* Edit */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#2563EB",
                                                        backgroundColor: "rgba(37,99,235,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(37,99,235,0.15)",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setUserForm(u);
                                                        setOpenUser(true);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Edit
                                                    </Typography>
                                                </Stack>

                                                {/* Delete */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#DC2626",
                                                        backgroundColor: "rgba(220,38,38,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(220,38,38,0.15)",
                                                        },
                                                    }}
                                                >
                                                    <BlockIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Delete
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            )}

            {/* ===== USER DIALOG ===== */}
            <Dialog open={openUser} onClose={() => setOpenUser(false)} fullWidth>
                <DialogTitle>{editingUser ? "Modify User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        {/* Name */}
                        <TextField
                            label="Name"
                            fullWidth
                            value={userForm.name}
                            onChange={(e) =>
                                setUserForm({ ...userForm, name: e.target.value })
                            }
                        />
                        {/* Email */}
                        <TextField
                            label="Email"
                            fullWidth
                            value={userForm.email}
                            onChange={(e) =>
                                setUserForm({ ...userForm, email: e.target.value })
                            }
                        />
                        {/* Role */}
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                label="Role"
                                value={userForm.role}
                                onChange={(e) =>
                                    setUserForm({ ...userForm, role: e.target.value as RoleType })
                                }
                            >
                                {ROLES.map((r) => (
                                    <MenuItem key={r} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* State */}
                        <FormControl fullWidth>
                            <InputLabel>State</InputLabel>
                            <Select
                                label="State"
                                value={userForm.state}
                                onChange={(e) =>
                                    setUserForm({ ...userForm, state: e.target.value as UserState })
                                }
                            >
                                {STATES.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Primary Customer Service */}
                        <FormControl fullWidth>
                            <InputLabel>Primary Customer Service</InputLabel>
                            <Select
                                label="Primary Customer Service"
                                value={userForm.primaryCustomerService || ""}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        primaryCustomerService: e.target.value,
                                    })
                                }
                            >
                                {customerServices.map((c) => (
                                    <MenuItem key={c.id} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Secondary Customer Service */}
                        <FormControl fullWidth>
                            <InputLabel>Secondary Customer Service</InputLabel>
                            <Select
                                label="Secondary Customer Service"
                                value={userForm.secondaryCustomerService || ""}
                                onChange={(e) =>
                                    setUserForm({
                                        ...userForm,
                                        secondaryCustomerService: e.target.value,
                                    })
                                }
                            >
                                {customerServices.map((c) => (
                                    <MenuItem key={c.id} value={c.name}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUser(false)}>Cancel</Button>
                    <Button sx={gradientButton} onClick={saveUser}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ===== ROLES, GROUPS, CUSTOMER SERVICES ===== */}
            {tab === 1 && (
                <Paper sx={tablePaperStyles}>
                    <Box px={3} py={1} display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Roles</Typography>
                        <Button
                            sx={gradientButton}
                            onClick={() => {
                                setEditingRole(null);
                                setRoleForm(emptyRole);
                                setOpenRole(true);
                            }}
                        >
                            Add Role
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Role Name</TableCell>
                                    <TableCell sx={headerCellStyles}>Status</TableCell>

                                    {/* Common Actions header */}
                                    <TableCell
                                        sx={{
                                            ...headerCellStyles,
                                            textAlign: "center",
                                            width: 220,
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {roles.map(r => (
                                    <TableRow key={r.id} hover>
                                        <TableCell sx={{ fontSize: 15 }}>{r.name}</TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>
                                            <Chip
                                                label={r.active ? "Active" : "Inactive"}
                                                size="small"
                                                sx={r.active ? chipActive : chipInactive}
                                            />
                                        </TableCell>

                                        {/* Actions Cell */}
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {/* Edit */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#2563EB",
                                                        backgroundColor: "rgba(37,99,235,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(37,99,235,0.15)",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setEditingRole(r);
                                                        setRoleForm(r);
                                                        setOpenRole(true);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Edit
                                                    </Typography>
                                                </Stack>

                                                {/* Delete */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#DC2626",
                                                        backgroundColor: "rgba(220,38,38,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(220,38,38,0.15)",
                                                        },
                                                    }}
                                                    onClick={() =>
                                                        setRoles(prev => prev.filter(x => x.id !== r.id))
                                                    }
                                                >
                                                    <BlockIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Delete
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            )}

            {tab === 2 && (
                <Paper sx={tablePaperStyles}>
                    <Box px={3} py={1} display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Groups</Typography>
                        <Button
                            sx={gradientButton}
                            onClick={() => {
                                setEditingGroup(null);
                                setGroupForm(emptyGroup);
                                setOpenGroup(true);
                            }}
                        >
                            Add Group
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Group Name</TableCell>
                                    <TableCell sx={headerCellStyles}>Status</TableCell>

                                    {/* Common Actions header */}
                                    <TableCell
                                        sx={{
                                            ...headerCellStyles,
                                            textAlign: "center",
                                            width: 220,
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {groups.map(g => (
                                    <TableRow key={g.id} hover>
                                        <TableCell sx={{ fontSize: 15 }}>{g.name}</TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>
                                            <Chip
                                                label={g.active ? "Active" : "Inactive"}
                                                size="small"
                                                sx={g.active ? chipActive : chipInactive}
                                            />
                                        </TableCell>

                                        {/* Actions cell */}
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {/* Edit */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#2563EB",
                                                        backgroundColor: "rgba(37,99,235,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(37,99,235,0.15)",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setEditingGroup(g);
                                                        setGroupForm(g);
                                                        setOpenGroup(true);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Edit
                                                    </Typography>
                                                </Stack>

                                                {/* Delete */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#DC2626",
                                                        backgroundColor: "rgba(220,38,38,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(220,38,38,0.15)",
                                                        },
                                                    }}
                                                    onClick={() =>
                                                        setGroups(prev => prev.filter(x => x.id !== g.id))
                                                    }
                                                >
                                                    <BlockIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Delete
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            )}
            {tab === 3 && (
                <Paper sx={tablePaperStyles}>
                    <Box px={3} py={1} display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>Customer Services</Typography>
                        <Button
                            sx={gradientButton}
                            onClick={() => {
                                setEditingCS(null);
                                setCsForm(emptyCS);
                                setOpenCS(true);
                            }}
                        >
                            Add Customer Service
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headerCellStyles}>Service Name</TableCell>
                                    <TableCell sx={headerCellStyles}>Groups</TableCell>

                                    {/* Common header */}
                                    <TableCell
                                        sx={{
                                            ...headerCellStyles,
                                            textAlign: "center",
                                            width: 220,
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {customerServices.map(cs => (
                                    <TableRow key={cs.id} hover>
                                        <TableCell sx={{ fontSize: 15 }}>{cs.name}</TableCell>

                                        <TableCell sx={{ fontSize: 15 }}>
                                            {cs.groupIds
                                                .map(id => groups.find(g => g.id === id)?.name)
                                                .join(", ")}
                                        </TableCell>

                                        {/* Actions cell */}
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {/* Edit */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#2563EB",
                                                        backgroundColor: "rgba(37,99,235,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(37,99,235,0.15)",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setEditingCS(cs);
                                                        setCsForm(cs);
                                                        setOpenCS(true);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Edit
                                                    </Typography>
                                                </Stack>

                                                {/* Delete */}
                                                <Stack
                                                    direction="row"
                                                    spacing={0.8}
                                                    alignItems="center"
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.6,
                                                        borderRadius: 1.5,
                                                        cursor: "pointer",
                                                        color: "#DC2626",
                                                        backgroundColor: "rgba(220,38,38,0.08)",
                                                        transition: "all 0.25s ease",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(220,38,38,0.15)",
                                                        },
                                                    }}
                                                    onClick={() =>
                                                        setCustomerServices(prev =>
                                                            prev.filter(x => x.id !== cs.id)
                                                        )
                                                    }
                                                >
                                                    <BlockIcon fontSize="small" />
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        Delete
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog open={openRole} onClose={() => setOpenRole(false)} fullWidth>
                <DialogTitle>{editingRole ? "Modify Role" : "Add Role"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Select
                            fullWidth
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value as RoleType)}
                        >
                            {ROLES.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRole(false)}>Cancel</Button>
                    <Button sx={gradientButton} onClick={saveRole}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openGroup} onClose={() => setOpenGroup(false)} fullWidth>
                <DialogTitle>Add Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Group Name"
                        fullWidth
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGroup(false)}>Cancel</Button>
                    <Button sx={gradientButton} onClick={saveGroup}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCS} onClose={() => setOpenCS(false)} fullWidth>
                <DialogTitle>Add Customer Service</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Customer Service Name"
                            fullWidth
                            value={csName}
                            onChange={(e) => setCsName(e.target.value)}
                        />
                        <Select
                            multiple
                            value={selectedGroups}
                            onChange={(e) =>
                                setSelectedGroups(e.target.value as string[])
                            }
                            renderValue={(selected) =>
                                (selected as string[])
                                    .map((id) => groups.find((g) => g.id === id)?.name)
                                    .join(", ")
                            }
                        >
                            {groups.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                    {g.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCS(false)}>Cancel</Button>
                    <Button sx={gradientButton} onClick={saveCS}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
