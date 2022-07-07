import { Alert, AppBar, Box, Fab, Toolbar, Typography, Zoom } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';

import SxBox from "../components/SxBox";
import { useRef } from "react";
import AppPreview from "../components/AppPreview";
import { InView } from "react-intersection-observer";

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
                        <a href="https://hydrocode.de" target="_blank" rel="noreferrer">
                        <img src="/logo.png" alt="logo" style={{height: 32, marginRight: '1.5rem'}} />
                        </a>
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
                    <InView triggerOnce>
                        {({inView, ref}) => (
                            <Zoom ref={ref} in={inView} style={{transitionDelay: '500ms', transitionDuration: '450ms'}}>
                                <Typography variant="h4" component="div">by hydrocode</Typography>
                            </Zoom>
                        )}
                    </InView>
                    
                    
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
                    <AppPreview imgSrc="/img/kriging_application.png" link="/kriging" reverse animate>
                        <Typography variant="h3" component="div">Kriging Application</Typography>
                        <Typography variant="body1" component="p" sx={{maxWidth: 500}}>
                            This chapter is dedicated to the different Kriging algorithms.
                            Use one of the many prepared datasets to jump directly into spatial interpolation. 
                        </Typography>
                        <Alert severity="info">It is highly recommended to company the application with geostatistical literature.</Alert>
                    </AppPreview>
                </SxBox>

                <SxBox height="50vh">
                <AppPreview imgSrc="/img/uncertain_geostatistics.png" link="/uncertain" animate>
                        <Typography variant="h3" component="div">Uncertain Geostatistics</Typography>
                        <Typography variant="body1" component="p" sx={{maxWidth: 500}}>
                            Start this chapter from SciKit-Uncertainty as a standalone application to
                            interactively explore how observation uncertainty influences each step of
                            geostistical workflows. 
                        </Typography>
                        <Alert severity="info">It is highly recommended to read the related paper. Link will follow.</Alert>
                    </AppPreview>
                </SxBox>
            </div>
        </>
    );
}

export default HomePage;
