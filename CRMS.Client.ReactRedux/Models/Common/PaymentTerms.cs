using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models.Common
{
    public class PaymentTerms
    {
        public int paymentTermsNumber { get; set; }
        public int daysOfCredit { get; set; }
        public string name { get; set; }
        public string paymentTermsType { get; set; }
    }
}
