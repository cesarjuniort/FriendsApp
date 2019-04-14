using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FriendsApp.API.Data;
using FriendsApp.API.Dtos;
using FriendsApp.API.Helpers;
using FriendsApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FriendsApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IFriendsRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;
        public PhotosController(IFriendsRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.cloudinaryConfig = cloudinaryConfig;
            this.mapper = mapper;
            this.repo = repo;

            Account cloudAccount = new Account(
                cloudinaryConfig.Value.ClouldName, cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiSecret);
            cloudinary = new Cloudinary(cloudAccount);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await repo.GetPhoto(id);
            var photo = mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);

        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            // verify that the user is updating its own profile.
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await repo.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = cloudinary.Upload(uploadParams);
                }
            } else {
                return BadRequest();
            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = mapper.Map<Photo>(photoForCreationDto);

            //verify is the user don't have a 'main photo' to set the current upload as main.
            if (!userFromRepo.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }
            userFromRepo.Photos.Add(photo);

            if (await repo.SaveAll())
            {
                var photoToReturn = mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",
                                      new { id = photo.Id },
                                      photoToReturn);
            }
            return BadRequest("Could not add the photo");
        }

    }
}