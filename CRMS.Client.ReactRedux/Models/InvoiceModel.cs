using CRMS.Client.ReactRedux.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
   

    public class InvoiceProduct
    {
        public string productNumber { get; set; }
        public int subscriptionId { get; set; }

    }

    public class Line
    {
        public int lineNumber { get; set; }
        public int sortKey { get; set; }
        public string description { get; set; }
        public Unit unit { get; set; }
        public InvoiceProduct product { get; set; }
        public double quantity { get; set; }
        public double unitNetPrice { get; set; }
        public double discountPercentage { get; set; }
        //public double unitCostPrice { get; set; }
        public double totalNetAmount { get; set; }
        //public double marginInBaseCurrency { get; set; }
        //public double marginPercentage { get; set; }
    }



    public class Customer
    {
        public int customerNumber { get; set; }
    }

    
    public class Delivery
    {
        public string address { get; set; }
        public string zip { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string deliveryDate { get; set; }
    }

    public class References
    {
        public string other { get; set; }
    }

    public class Layout
    {
        public int layoutNumber { get; set; }
    }

    public class Pdf
    {
        public string download { get; set; }
    }

    public class InvoiceModel
    {
        public int draftInvoiceNumber { get; set; }
        public List<Line> lines { get; set; } = new List<Line>();
        public string date { get; set; }
        public string currency { get; set; }
        //public double exchangeRate { get; set; }
        //public double netAmount { get; set; }
        //public double netAmountInBaseCurrency { get; set; }
        //public double grossAmount { get; set; }
        //public double grossAmountInBaseCurrency { get; set; }
        //public double marginInBaseCurrency { get; set; }
        //public double marginPercentage { get; set; }
        public double vatAmount { get; set; }
        //public double roundingAmount { get; set; }
        //public double costPriceInBaseCurrency { get; set; }
        public string dueDate { get; set; }
        public PaymentTerms paymentTerms { get; set; }
        public Customer customer { get; set; }
        public Recipient recipient { get; set; }
        public VatZone vatZone { get; set; }
        public Delivery delivery { get; set; }
        public References references { get; set; }
        public Layout layout { get; set; }
        public InvoiceDraftLog draftLog { get; set; }
        //public Pdf pdf { get; set; }
    }



  

}
