using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    public class InvoiceDraftLog
    {
        public int Id { get; set; }
        public int InvoiceDraftId { get; set; }
        public string UserEmail { get; set; }
        public DateTime InvoiceDateTime { get; set; } 
    }
}
