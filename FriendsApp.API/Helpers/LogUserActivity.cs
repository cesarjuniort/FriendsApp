using System;
using System.Security.Claims;
using System.Threading.Tasks;
using FriendsApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace FriendsApp.API.Helpers
{
    // Author: Cesar Toribio
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Access to the context 'After' the action filter excecuted. (Think of it like a SQL Trigger OnAfterUpdate)
            // resultContext is loaded with a ton of things on it, like the controller, where it came from, the
            // the full Request/Response Objects with all details (from here you can think into delegating into
            // Adapters to further 'watch' and log things as needed).
            var resultContext = await next();
            

            // Now, lets get the user id based on the JWT token.
            // Nothing at this level really knows or care about JWT; it could be AD, ASP Auth etc etc.
            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);


            // Based on the request context container, let go backwards and get the instance of the DI-Injected Repo implementing class.
            // just to update the User's last activity datetime; this will serve of the purpose to display the "Last Activity" or "Last-seen"
            // to the current user's friends.
            var repo = resultContext.HttpContext.RequestServices.GetService<IFriendsRepository>();
            
            // async call to the DB, here the server thread can do other tasks, this method resumes its state when the DB completes.
            var user = await repo.GetUser(userId); 
            user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}