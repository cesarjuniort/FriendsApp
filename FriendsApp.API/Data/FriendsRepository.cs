using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendsApp.API.Helpers;
using FriendsApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FriendsApp.API.Data
{
    public class FriendsRepository : IFriendsRepository
    {
        private readonly DataContext context;
        public FriendsRepository(DataContext context)
        {
            this.context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(PageRequestUserParams pageInfo)
        {
            var users = context.Users.Include(p=>p.Photos).OrderByDescending(u=>u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != pageInfo.UserId);
            users = users.Where(u => u.Gender == pageInfo.Gender); // that could be combined with previous line, but wanted to keep it separated to remind that 'where' predicates can be combined in chunks, very powerful stuff.
            var minDBO = DateTime.Today.AddYears(-pageInfo.MinAge);
            var maxDBO = DateTime.Today.AddYears(-pageInfo.MaxAge);
            users = users.Where(u => u.DateOfBirth<= minDBO && u.DateOfBirth >= maxDBO);

            if(!string.IsNullOrEmpty(pageInfo.OrderBy)) 
            {
                switch (pageInfo.OrderBy) {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users,pageInfo.PageNumber,pageInfo.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await context.Photos.Where(p => p.UserId == userId && p.IsMain).FirstOrDefaultAsync();
            return photo;
        }
    }
}