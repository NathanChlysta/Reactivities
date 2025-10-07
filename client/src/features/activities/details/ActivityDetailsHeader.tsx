import { Card, CardMedia, Box, Typography, Chip, Modal } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { formatDate } from "../../../lib/util/util";
import { useActivities } from "../../../lib/hooks/useActivities";
import StyledButton from "../../../app/shared/components/StyledButton";
import { useState } from "react";

type Props = {
    activity: Activity
}

export default function ActivityDetailsHeader({ activity }: Props) {
    const { deleteActivity, updateAttendance } = useActivities(activity.id);
    const navigate = useNavigate();

    // style for modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Card sx={{ position: 'relative', mb: 2, backgroundColor: 'transparent', overflow: 'hidden' }}>
            <CardMedia
                component="img"
                height="300"
                image={`/images/categoryImages/${activity.category}.jpg`}
                alt={`${activity.category} image`}
            />

            {/* ✅ Top Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 2,
                    boxSizing: 'border-box',
                    zIndex: 1000,
                }}
            >
                {/* Left: Cancelled chip (or empty box) */}
                <Box>
                    {activity.isCancelled && (
                        <Chip
                            color="error"
                            label="Cancelled"
                            sx={{ borderRadius: 1 }}
                        />
                    )}
                </Box>

                {/* Right: Top-right button (or empty box) */}
                <Box>
                    {activity.isHost && (
                        <>
                            <StyledButton
                                onClick={handleOpen}
                                variant="contained"
                                color="error"
                            >
                                Delete Activity
                            </StyledButton>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Delete Activity
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Are you sure you want to delete this activity? This action cannot be undone.
                                    </Typography>
                                    <Box sx={{ display: 'flex' }}>
                                        <StyledButton
                                            color="error"
                                            onClick={() => {
                                                deleteActivity.mutate(activity.id)
                                                navigate(-1)
                                            }}
                                        >
                                            Delete
                                        </StyledButton>
                                        <StyledButton
                                            color="primary"
                                            onClick={handleClose}
                                        >
                                            Cancel
                                        </StyledButton>
                                    </Box>
                                </Box>
                            </Modal>
                        </>
                    )}
                </Box>
            </Box>

            {/* ✅ Bottom Overlay */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                color: 'white',
                padding: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 1.0), transparent)',
                boxSizing: 'border-box',
            }}>
                {/* Text Section */}
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activity.title}</Typography>
                    <Typography variant="subtitle1">{formatDate(activity.date)}</Typography>
                    <Typography variant="subtitle2">
                        Hosted by <Link to={`/profiles/${activity.hostId}`} style={{ color: 'white', fontWeight: 'bold' }}>
                            {activity.hostDisplayName}
                        </Link>
                    </Typography>
                </Box>

                {/* Buttons Section */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {activity.isHost ? (
                        <>
                            <StyledButton
                                variant='contained'
                                color={activity.isCancelled ? 'success' : 'warning'}
                                onClick={() => updateAttendance.mutate(activity.id)}
                                disabled={updateAttendance.isPending}
                            >
                                {activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}
                            </StyledButton>
                            <StyledButton
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/manage/${activity.id}`}
                                disabled={activity.isCancelled}
                            >
                                Manage Event
                            </StyledButton>
                        </>
                    ) : (
                        <StyledButton
                            variant="contained"
                            color={activity.isGoing ? 'primary' : 'info'}
                            onClick={() => updateAttendance.mutate(activity.id)}
                            disabled={updateAttendance.isPending || activity.isCancelled}
                        >
                            {activity.isGoing ? 'Cancel Attendance' : 'Join Activity'}
                        </StyledButton>
                    )}
                </Box>
            </Box>
        </Card>

    )
}
