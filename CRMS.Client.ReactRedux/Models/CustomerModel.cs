using CRMS.Client.ReactRedux.Models.Common;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    public class CustomerModel
    {
        public int customerNumber { get; set; }
        public string currency { get; set; }
        public PaymentTerms paymentTerms { get; set; }
        public CustomerGroup customerGroup { get; set; }
        public string address { get; set; }
        public double balance { get; set; }
        public double dueAmount { get; set; }
        public string corporateIdentificationNumber { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string zip { get; set; }
        public string telephoneAndFaxNumber { get; set; }
        public string website { get; set; }
        public VatZone vatZone { get; set; }
        public DateTime lastUpdated { get; set; }
        public bool eInvoicingDisabledByDefault { get; set; }
        public List<CustomersDomainsModel> domains { get; set; }


        public bool ValidateCustomer()
        {   
            if(string.IsNullOrEmpty(this.name))
            {
                return false;
            }
            if (string.IsNullOrEmpty(this.currency))
            {
                return false;
            }
            return true;
        }
    }

 

    public class CustomerGroup
    {
        public int customerGroupNumber { get; set; }
    }
 
}
