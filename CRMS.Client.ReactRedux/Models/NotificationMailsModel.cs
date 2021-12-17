using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    public class NotificationMailsModel
    {     
        public int Id { get; set; }
        public string Email { get; set; }

        public bool Validate()
        {
            if (!Regex.IsMatch(Email, @"^[a-z0-9]+(\.[a-z0-9]+)?@+[a-z0-9]+\.[a-z]{2,3}$"))
            {
                return false;
            }  
            return true;
        }
    }    
}
