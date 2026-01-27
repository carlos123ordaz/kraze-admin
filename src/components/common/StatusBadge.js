'use client';

import { Chip } from '@mui/material';

const colorMap = {
    success: { bg: '#D4EDDA', color: '#155724' },
    error: { bg: '#F8D7DA', color: '#721C24' },
    warning: { bg: '#FFF3CD', color: '#856404' },
    info: { bg: '#D1ECF1', color: '#0C5460' },
    primary: { bg: '#CCE5FF', color: '#004085' },
    default: { bg: '#E2E3E5', color: '#383D41' },
};

export default function StatusBadge({ status, label, color = 'default' }) {
    const colors = colorMap[color] || colorMap.default;

    return (
        <Chip
            label={label || status}
            size="small"
            sx={{
                backgroundColor: colors.bg,
                color: colors.color,
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                    px: 1.5,
                },
            }}
        />
    );
}