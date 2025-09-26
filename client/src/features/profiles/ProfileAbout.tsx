import { useParams } from "react-router"
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import ProfileEdit from "./ProfileEditForm";

export default function ProfileAbout() {
    const { id } = useParams();
    const { profile, isCurrentUser } = useProfile(id);
    const [editMode, setEditMode] = useState(false)

    return (
        <Box>
            <Box display='flex' justifyContent='space-between'>
                <Typography variant="h5">About {profile?.displayName}</Typography>
                {isCurrentUser &&
                    <Button onClick={() => setEditMode(!editMode)}>
                        Edit Profile
                    </Button>}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ overflow: 'auto', maxHeight: 350 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile?.bio || 'No description added yet'}
                </Typography>
                {editMode && (
                    <ProfileEdit setEditMode={setEditMode} />
                )}
            </Box>
        </Box>
    )
}