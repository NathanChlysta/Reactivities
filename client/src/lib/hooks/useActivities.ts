import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";


// makes api calls for queries and commands (?)
export const useActivities = (id?: string) => {

    const queryClient = useQueryClient();
    const { currentUser } = useAccount();
    const location = useLocation();

    

    // get list of activities (?)
    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
            const response = await agent.get<Activity[]>('/activities');
            return response.data;
        },
        enabled: !id && location.pathname === '/activities' && !!currentUser,
        select: data => {
            return data.map(activity => {
                return {
                    ...activity,
                    isHost: currentUser?.id === activity.hostId,
                    isGoing: activity.attendees.some(x => {
                        x.id === currentUser?.id
                        console.log(x)
                        console.log("COMPARING: " + x.id + " VS " + currentUser?.id) // somehow x.id is displayName, currentUser.id is correct
                    })
                }
            })
        }
    });

    // get activity details
    const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activitiies', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`)
            return response.data
        },
        enabled: !!id && !!currentUser,
        select: data => {
            return {
                ...data,
                isHost: currentUser?.id === data.hostId,
                isGoing: data.attendees.some(x => x.id === currentUser?.id)
            }
        }
    })

    // edit an activity
    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => (
            await agent.put('/activities', activity)
        ),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    // create activity
    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post('/activities', activity);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    //delete an activity
    const deleteActivity = useMutation({
        mutationFn: async (id: string) => (
            await agent.delete(`/activities/${id}`)
        ),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    return {
        activities,
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity
    }
}