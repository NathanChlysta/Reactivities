import { Box, ClickAwayListener, Popover, Typography } from "@mui/material";
import MapComponent from "./MapComponent";
import { useRef, useState } from "react";

type Props = {
    activity: Activity
}

export default function MapPopover({ activity }: Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        triggerRef.current = event.currentTarget;
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    // thanks chat
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
        // Prevent closing if the click is inside the trigger element (venue text)
        if (triggerRef.current?.contains(event.target as Node)) return;
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Typography
                variant="body2"
                onMouseEnter={handlePopoverOpen}
            >{activity.venue}</Typography>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                slotProps={{
                    paper: {
                        onMouseEnter: () => { }, // prevent auto-close
                        onMouseLeave: () => { }, // prevent auto-close
                    },
                }}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box width={400} height={275}>
                        <MapComponent position={[activity.latitude, activity.longitude]}
                            venue={activity.venue} />
                    </Box>
                </ClickAwayListener>
            </Popover>
        </>
    );
}