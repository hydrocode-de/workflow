import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface DataLoaderToolProps {
    onChange: (props: {[key: string]: any}) => void;
}

const DataLoaderTool: React.FC<DataLoaderToolProps> = ({  onChange }) => {
    // state
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        onChange({ data_id: value});
    }, [value, onChange])
    
    return (
        <>
            <Typography variant="h6">Data Loader</Typography>
            <Typography variant="caption" component="p">
                Select the dataset to use in this branch of the workflow.
            </Typography>
            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                <Select label="Dataset" value={value} onChange={e =>  setValue(e.target.value)}>
                    <MenuItem value="">- None -</MenuItem>
                    <MenuItem value={'7'}>Attert 2013</MenuItem>
                    <MenuItem value={'9'}>Attert 2013 - Thin sample</MenuItem>
                    <MenuItem value={'11'}>Attert 2015</MenuItem>
                    <MenuItem value={'14'}>Attert 2015 - Thin sample</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default DataLoaderTool;