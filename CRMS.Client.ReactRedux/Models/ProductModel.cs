using CRMS.Client.ReactRedux.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    public class ProductModel
    {
        public string productNumber { get; set; }
        public string description { get; set; }
        public string name { get; set; }
        public float costPrice { get; set; }
        public float recommendedPrice { get; set; }
        public float salesPrice { get; set; }
        public bool barred { get; set; }
        public DateTime lastUpdated { get; set; }
        public ProductGroup productGroup { get; set; }
        public Unit unit { get; set; }
    }  

    public class ProductGroup
    {
        public int productGroupNumber { get; set; }
        public string name { get; set; }
    }    
}
