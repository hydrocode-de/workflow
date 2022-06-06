import { Box, SxProps } from "@mui/material"
import React from "react";


const SxBox: React.FC<React.PropsWithChildren<SxProps>> = ({children, ...sxOverrides}) => {    
    const defaults: SxProps = {
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
    }
    
    return (
        <Box sx={{...defaults, ...sxOverrides}}>
            { children } 
        </Box>
    );
}

export default SxBox;
