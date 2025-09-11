using System;
using Domain;
using AutoMapper;
using Application.Activities.DTOs;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActiviytDto, Activity>();
    }


}
