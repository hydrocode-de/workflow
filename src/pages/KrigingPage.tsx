import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import StreamlitLoader from "../components/StreamlitLoader";

const UncertainGeostatPage: React.FC = () => {
    return (
        <>
            <Box sx={{flewGrow: 1}}>
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}} href="/">
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>Uncertain Geostatistics</Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{flexGrow: 1, m: 0, p: 0, height: 'calc(100vh - 64px)', width: '100vw'}}>
                <StreamlitLoader title="Kriging Application" src="https://kriging.geostat.hydrocode.de" />
            </Box>
        </>
    );
}

export default UncertainGeostatPage;

