using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models.Dtos
{
    public class UsersWithRolesDto  
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string SecurityStamp { get; set; }
        public string ConcurrencyStamp { get; set; }
        public List<Role> Roles { get; set; } = new List<Role>();  
    }

    public class Role
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
    }
}




