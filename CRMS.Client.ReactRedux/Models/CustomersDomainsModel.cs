using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    public class CustomersDomainsModel
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string DomainName { get; set; }
         


        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public CustomersDomainsModel()
        {

        }

        public bool ValidateWithoutId()
        {
            if (!ValidateDomainName())
            {
                return false;
            }
            else if (CustomerId == 0)
            {
                return false;
            }
            return true;
        }


        public bool ValidateAll()
        {
            if (!ValidateDomainName())
            {
                return false;
            }
            else if(CustomerId == 0)
            {
                return false;
            }
            else if(Id == 0)
            {
                return false;
            }
            return true;
        }


        public bool ValidateDomainName()
        {
            if (!Regex.IsMatch(DomainName, @"(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$"))
            {
                return false;
            }
            return true;
        }
    }
}
