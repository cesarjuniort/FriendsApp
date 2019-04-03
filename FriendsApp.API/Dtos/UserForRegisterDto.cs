using System.ComponentModel.DataAnnotations;

namespace FriendsApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }   
        
        [Required]
        [StringLength(50, MinimumLength = 4, ErrorMessage="The password must be between 4 and 50 characters long.")]
        public string Password { get; set; }   
    }
}