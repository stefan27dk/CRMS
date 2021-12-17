using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models.Common
{
    public class Recipient
    {
        public string name { get; set; }
        public string address { get; set; }
        public string zip { get; set; }
        public string city { get; set; }
        public VatZone vatZone { get; set; }
        public string cvr { get; set; }
    }
}
