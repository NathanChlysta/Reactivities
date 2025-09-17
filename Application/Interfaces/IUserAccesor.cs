using System;
using Domain;

namespace Application.Interfaces;

public interface IUserAccesor
{
    string GetUserId();
    Task<User> GetUserAsync();
}
