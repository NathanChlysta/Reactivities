import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";


// makes api calls for queries and commands regarding activities (and attencance)
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
                    isGoing: activity.attendees.some(x => x.id === currentUser?.id)
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

    // cancel/toggle attendence
    const updateAttendence = useMutation({
        mutationFn: async (id: string) => {
            await agent.post(`/activities/${id}/attend`)
        },
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({ queryKey: ['activities', activityId] })

            const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId])

            queryClient.setQueryData<Activity>(['activity', activityId], oldActivity => {
                if (!oldActivity || !currentUser) {
                    return oldActivity
                }

                const isHost = oldActivity.hostId === currentUser.id;
                const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id)

                return {
                    ...oldActivity,
                    isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
                    attendees: isAttending
                        ? isHost
                            ? oldActivity.attendees
                            : oldActivity.attendees.filter(x => x.id !== currentUser.id)
                        : [...oldActivity.attendees, {
                            id: currentUser.id,
                            displayName: currentUser.displayName,
                            imageUrl: currentUser.imageUrl
                        }]
                }
            })
            return {prevActivity}
        },
        onError: (error, activityId, context) => {
            console.log('PREV ACTIVITY: ' + context?.prevActivity)
            console.log(error)
            if (context?.prevActivity) {
                queryClient.setQueryData(['activities', activityId], context?.prevActivity)
            }
        }
    })

    return {
        activities,
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity,
        updateAttendence
    }
}