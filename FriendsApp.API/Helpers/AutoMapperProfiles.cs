using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using FriendsApp.API.Models;
using FriendsApp.API.Helpers;

namespace FriendsApp.API.Dtos
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(destination => destination.PhotoUrl, options => {
                    options.MapFrom(source => source.Photos.FirstOrDefault( p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, map => {
                    map.MapFrom((s,d) => s.DateOfBirth.CalculateAge());
                } );
            CreateMap<User, UserForDetailDto>()
                .ForMember(dest => dest.Age, map => {
                    map.MapFrom((s,d) => s.DateOfBirth.CalculateAge());
                } )
                .ForMember(dest => dest.PhotoUrl, 
                        map => {
                            map.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url);
                            }
                );

            CreateMap<Photo, PhotosForDetailDto>();

            CreateMap<UserForUpdateDto, User>();

            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();
        }
    }
}