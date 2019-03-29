using Microsoft.EntityFrameworkCore;
using FriendsApp.API.Models;

namespace FriendsApp.API.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options){            
        }

        public DbSet<AppValue> AppValues {get;set;}
        public DbSet<User> Users {get;set;}
    }
}