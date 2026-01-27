'use client';

import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Buscar...',
    fullWidth = true,
    sx = {},
}) {
    return (
        <TextField
            fullWidth={fullWidth}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search fontSize="small" />
                    </InputAdornment>
                ),
            }}
            sx={{
                backgroundColor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'divider',
                    },
                },
                ...sx,
            }}
        />
    );
}