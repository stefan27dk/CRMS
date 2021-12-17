using CRMS.Client.ReactRedux.Frame;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    // == || CLASS - SubscriptionsModel || ============================================================================================================================== 
    public class SubscriptionsModel
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        //public string Domain { get; set; }
        public BillingPeriodType BillingPeriodType { get; set; }
        //public Months ActivationMonth { get; set; }
        //public Months FitToMonth { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }  // Expiration Date
        public DateTime LastInvoiced { get; set; } // The last order Time
        public int ProductId { get; set; } // The product 
        public int CustomerId { get; set; } // The Customer
        public string Description { get; set; }   
        public int DomainId { get; set; }
       

        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public SubscriptionsModel()
        {
        }


        public bool Validate()
        {
            if(Quantity == 0)
            {
                return false;
            }
            else if (ProductId == 0)
            {
                return false;
            }
            else if (CustomerId == 0)
            {
                return false;
            }  
            else if (DomainId == 0)
            {
                return false;
            }
            return true;
        }
    }
}                 
