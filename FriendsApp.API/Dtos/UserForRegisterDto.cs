using System;
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

        [Required]
        public string Gender { get; set; }   
        [Required]
        public string KnownAs { get; set; }   
        [Required]
        public DateTime DateOfBirth { get; set; }   
        [Required]
        public string City { get; set; }   
        [Required]
        public string Country { get; set; }   
        public DateTime Created { get; set; }   
        public DateTime LastActive { get; set; }   

        public UserForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}