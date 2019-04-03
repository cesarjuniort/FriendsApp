using Microsoft.AspNetCore.Mvc;
using FriendsApp.API.Data;
using FriendsApp.API.Dtos;
using FriendsApp.API.Models;
using System.Threading.Tasks;

namespace FriendsApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto user)
        {
            // TODO: Validate request.

            user.Username = user.Username.ToLower();
            if (await _repo.UserExists(user.Username))
                return BadRequest("Username already exists.");

            var userToCreate = new User
            {
                Username = user.Username
            };

            var createdUser = await _repo.Register(userToCreate, user.Password);

            //TODO: Return using CreatedAtRoute()
            return StatusCode(201);
        }
    }
}