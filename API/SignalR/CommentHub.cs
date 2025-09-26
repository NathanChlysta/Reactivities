using System;
using System.Text.RegularExpressions;
using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{

    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);

        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value);
    }

    // When a client connects, we're going to add them 
    //     to a SignalR group based on the activity ID. 
    // When a new comment is added for that particular activity,
    //    we're going to send it to all connected clients for that group.
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId)) throw new HubException("No activity with this id");

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

        var result = await mediator.Send(new GetComments.Query { ActiivtyId = activityId! });

        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
