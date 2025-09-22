import { Link } from "react-router"
import { Card, CardContent, CardMedia, Box, Typography, Chip, Divider } from "@mui/material"
import { Person } from "@mui/icons-material";

type Props = {
    profile: Profile
}

export default function ProfileCard({ profile }: Props) {
    const following = false;

    return (
        <Link to={`/profiles/${profile.id}`} style={{ textDecoration: 'none' }}>
            <Card
                sx={{
                    borderRadius: 3,
                    p: 3,
                    maxWidth: 300,
                    textDecoration: 'none'
                }}
                elevation={4}
            >
                <CardMedia component='img' src={profile.imageUrl || '/images/user.png'}
                    sx={{ width: 200, zIndex: 50 }}
                    alt={profile.displayName + 'image'}
                />
                <CardContent>
                    <Box display='flex' alignItems='center' gap={1}>
                        <Typography variant="h5">{profile.displayName}</Typography>
                        {following && <Chip
                            size="small"
                            label='following'
                            color="secondary"
                            variant="outlined"
                        />}
                    </Box>
                </CardContent>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                    <Person />
                    <Typography sx={{ml: 1}}>20 Followers</Typography>
                </Box>
            </Card>
        </Link>
    )
}