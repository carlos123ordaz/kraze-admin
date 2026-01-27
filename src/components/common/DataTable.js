'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Box,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Skeleton,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useState } from 'react';

export default function DataTable({
    columns,
    rows,
    loading = false,
    page = 0,
    rowsPerPage = 10,
    totalRows = 0,
    onPageChange,
    onRowsPerPageChange,
    selectable = false,
    selected = [],
    onSelectAll,
    onSelectOne,
    actions = [],
    emptyMessage = 'No hay datos para mostrar',
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleActionClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleActionClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleActionItemClick = (action) => {
        if (selectedRow && action.onClick) {
            action.onClick(selectedRow);
        }
        handleActionClose();
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    if (loading) {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {selectable && <TableCell padding="checkbox" />}
                            {columns.map((column) => (
                                <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                            {actions.length > 0 && <TableCell align="right">Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                {selectable && <TableCell padding="checkbox" />}
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        <Skeleton />
                                    </TableCell>
                                ))}
                                {actions.length > 0 && <TableCell />}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    if (rows.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">{emptyMessage}</Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {selectable && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < rows.length}
                                        checked={rows.length > 0 && selected.length === rows.length}
                                        onChange={onSelectAll}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    sx={{ fontWeight: 600 }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            {actions.length > 0 && (
                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Acciones
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            const isItemSelected = isSelected(row.id);

                            return (
                                <TableRow
                                    key={row.id}
                                    hover
                                    selected={isItemSelected}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                onChange={() => onSelectOne(row.id)}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align || 'left'}>
                                            {column.render ? column.render(row) : row[column.id]}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 && (
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleActionClick(e, row)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalRows > rowsPerPage && (
                <TablePagination
                    component="div"
                    count={totalRows}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionClose}
            >
                {actions.map((action) => (
                    <MenuItem
                        key={action.label}
                        onClick={() => handleActionItemClick(action)}
                        sx={{ gap: 1 }}
                    >
                        {action.icon}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Paper>
    );
}