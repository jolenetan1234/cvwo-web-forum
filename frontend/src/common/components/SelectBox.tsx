import { Box, InputLabel, MenuItem, Select } from "@mui/material";

interface SelectBoxProps {
    value: string,
    options: {
        label: string,
        value: string,
    }[]
    label: string,
    onChange: (value: string) => void,
}


export default function SelectBox({ value, options, label, onChange }: SelectBoxProps): JSX.Element {
    return (
        <Box>
            <InputLabel>{label}</InputLabel>
            <Select
            value={value}
            >
                {options.map(option => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}    
            </Select>
        </Box>
    )
}