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
using AutoMapper;

namespace FriendsApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            this.mapper = mapper;
            _repo = repo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // TODO: Validate request.

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists.");

            var userToCreate = mapper.Map<User>(userForRegisterDto);

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            //TODO: Return using CreatedAtRoute()
            return CreatedAtRoute("GetUser", new {controller="Users", id = createdUser.Id},
                mapper.Map<UserForDetailDto>(createdUser));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto user)
        {
            var userFromRepo = await _repo.Login(user.Username.ToLower(), user.Password);
            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            //contents of the token.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username),
            };

            // getting the key and signing the token to later verify that it is valid.
            var key = new SymmetricSecurityKey(Encoding.UTF8
                         .GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // building the token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(6),
                SigningCredentials = creds
            };

            // using jwt to handle the token creation
            var tokenHandler = new JwtSecurityTokenHandler();

            // writing the token into the response
            var tokenToBeDispatchedToClient = tokenHandler.CreateToken(tokenDescriptor);

            var user4List = mapper.Map<UserForListDto>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(tokenToBeDispatchedToClient),
                user = user4List
            });
        }
    }
}