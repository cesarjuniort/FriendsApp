using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendsApp.API.Data;
using FriendsApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FriendsApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext context;

        public ValuesController(DataContext context)
        {
            this.context = context;
        }
        // GET api/values
        [HttpGet]
        public async Task<IActionResult> GetValues()
        {
            Console.WriteLine("in GetValues");
            var values = await context.AppValues.ToListAsync();
            return Ok(values);
        }

        // GET api/values/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(string id)
        {
            var value = await context.AppValues.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AppValue value)
        {
            context.AppValues.Add(value);
            await context.SaveChangesAsync();
            return Ok(value);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody]  AppValue value)
        {
            var found = await context.AppValues.FirstOrDefaultAsync(x => x.Id == id);
            if (found == null)
            {
                return BadRequest("The specified Id doesn't exists. Use http post to create a new entry");
            }
            else
            {
                found.Value = value.Value;
                await context.SaveChangesAsync();
                return Ok(value);
            }
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var found = await context.AppValues.FirstOrDefaultAsync(x => x.Id == id);
            if (found != null)
            {
                context.Entry(found).State = EntityState.Deleted;
                await context.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
