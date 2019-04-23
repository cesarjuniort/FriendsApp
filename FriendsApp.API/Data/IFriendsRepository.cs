using System.Collections.Generic;
using System.Threading.Tasks;
using FriendsApp.API.Helpers;
using FriendsApp.API.Models;

namespace FriendsApp.API.Data
{
    public interface IFriendsRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();

         Task<PagedList<User>> GetUsers(PageRequestUserParams pageInfo);
         Task<User> GetUser(int id);
         Task<Photo> GetPhoto(int id);

         Task<Photo> GetMainPhotoForUser(int userId);

         Task<Like> GetLike (int userId, int recipientId);
    }
}