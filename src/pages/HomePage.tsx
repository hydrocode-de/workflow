import { Alert, AppBar, Box, Fab, Toolbar, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';

import SxBox from "../components/SxBox";
import { useRef } from "react";
import AppPreview from "../components/AppPreview";

const HomePage: React.FC = () => {
    // create scroll refs
    const appRef = useRef<HTMLDivElement>(null);

    const scrollHander = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'});
        }
    }

    return (
        <>
            {/* Header */}
            <Box sx={{flexGrow: 1}}>
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Geostatistics by hydrocode
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            <SxBox height="calc(100vh - 64px)" justifyContent="space-between">
                <Box></Box>
                <Box>
                    <Typography variant="h1" component="div">Geostatistics</Typography>
                    <Typography variant="h4" component="div">by hydrocode</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Fab color="primary" sx={{marginTop: '-64px'}} onClick={() => scrollHander(appRef)}>
                        <ExpandMore />
                    </Fab>
                </Box>
            </SxBox>

            <div ref={appRef}>

                <SxBox height="50vh">
                    <AppPreview imgSrc="/img/learn_geostatistics.png" link="/learn" animate>
                        <Typography variant="h3" component="div">Learning Geostatistics</Typography>
                        <Typography variant="body1" component="p" sx={{maxWidth: 500}}>
                            Start this chapter from SciKit-Uncertainty as a standalone application to
                            interactively build up a variogram step by step. 
                        </Typography>
                        <Alert severity="info">It is highly recommended to company the application with geostatistical literature.</Alert>
                    </AppPreview>
                </SxBox>

                <SxBox height="50vh">
                <AppPreview imgSrc="https://www.fillmurray.com/g/300/300" reverse animate>
                        <Typography variant="h3" component="div">Uncertain Geostatistics</Typography>
                        <Typography variant="body1" component="p" sx={{maxWidth: 500}}>
                            Start this chapter from SciKit-Uncertainty as a standalone application to
                            interactively explore how observation uncertainty influences each step of
                            geostistical workflows. 
                        </Typography>
                        <Alert severity="warning">This application is currently maintained and not available.</Alert>
                    </AppPreview>
                </SxBox>
            </div>
        </>
    );
}

export default HomePage;
