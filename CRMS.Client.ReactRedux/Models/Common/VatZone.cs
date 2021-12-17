using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models.Common
{
    public class VatZone
    {
        public string name { get; set; }
        public int vatZoneNumber { get; set; }
        public bool enabledForCustomer { get; set; }
        public bool enabledForSupplier { get; set; }
    }
}
