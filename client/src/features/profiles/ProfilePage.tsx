import { Grid, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";


export default function ProfilePage() {
    const { id } = useParams();
    const { profile, loadingProfile } = useProfile(id);

    if (loadingProfile) return <Typography>Loading profile...</Typography>

    if (!profile) return <Typography>Profile not found</Typography>

    return (
        <Grid >
            <Grid>
                <ProfileHeader />
                <ProfileContent />
            </Grid>
        </Grid>
    )
}