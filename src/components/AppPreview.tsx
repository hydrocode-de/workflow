import React, { useState } from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Zoom } from "@mui/material";
import { useInView } from "react-intersection-observer";



interface AppPreviewProps {
    imgSrc: string;
    width?: number;
    height?: number;
    reverse?: boolean;
    animate?: boolean;
    link?: string;
}

const AppPreview: React.FC<React.PropsWithChildren<AppPreviewProps>> = ({ imgSrc, width, height, reverse, animate, link, children }) => {
    // get a reference and a handler for viewport intersections
    const [ ref, inView, entry ] = useInView({threshold: 0.8});
    // create the two content elements
    
    const contentBox = (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 0 auto', p: 5}}>
                { children }
            </CardContent>
        </Box>
    );
    const thumbnail = (
        <CardMedia 
            component="img"
            sx={[{width: width || 300, height: height || 300, objectFit: 'contain'}, {'&:hover': {transform: 'sepia(0.5)'}}]}
            image={imgSrc}
            alt="App thumbnail"
        />
    );

    // build the card component itself
    let card: any;
    if (link) {
        card = (
            <Card sx={{display: 'flex'}}>
                <CardActionArea sx={{display: 'flex', alignItems: 'center'}} href={link}>
                    { reverse ? thumbnail : contentBox }
                    { reverse ? contentBox : thumbnail }
                </CardActionArea>
            </Card>
        );
    } else {
        card = (
            <Card sx={{display: 'flex', alignItems: 'center'}}>
                { reverse ? thumbnail : contentBox }
                { reverse ? contentBox : thumbnail }
            </Card>
        );
    }

    let body: any;

    if (animate) {
        body = (
                <Zoom ref={ref} in={inView} style={{transitionDelay: inView ? '300ms' : '0ms', transitionDuration: '800ms'}}>
                    { card }
                </Zoom>
        );
    } else {
        body = card;
    }

    // return component
    return body;
}

export default AppPreview;