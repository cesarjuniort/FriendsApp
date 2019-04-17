using Microsoft.AspNetCore.Mvc;
using FriendsApp.API.Data;
using FriendsApp.API.Dtos;
using FriendsApp.API.Models;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Collections.Generic;

namespace FriendsApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IFriendsRepository repo;
        private readonly IMapper mapper;
        public UsersController(IFriendsRepository repo, IMapper mapper)
        {
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await repo.GetUsers();
            var usersToReturn = mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await repo.GetUser(id);
            var usersToReturn = mapper.Map<UserForDetailDto>(user);
            return Ok(usersToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userUpdateDto)
        {
            // verify that the user is updating its own profile.
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(id);

            mapper.Map(userUpdateDto, userFromRepo);
            if (await repo.SaveAll()) {
                return NoContent();
            } else {
                throw new Exception($"An error occurred while saving the user with id {id}.");
            }
        }


    }
}