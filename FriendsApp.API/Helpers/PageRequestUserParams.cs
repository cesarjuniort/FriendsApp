namespace FriendsApp.API.Helpers
{
    public class PageRequestUserParams
    {
        private const int MaxPageSize = 50; // this could be moved to the app settings.
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize;}
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value;}
        }

        public int UserId {get;set;}
        public string Gender {get;set;}

        public int MinAge {get;set;}
        public int MaxAge {get;set;}

        public string OrderBy {get;set;}


        
    }
}