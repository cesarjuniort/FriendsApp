using System.Collections.Generic;
using System.Threading.Tasks;
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

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await context.Users.Include(p=>p.Photos).ToListAsync();
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}