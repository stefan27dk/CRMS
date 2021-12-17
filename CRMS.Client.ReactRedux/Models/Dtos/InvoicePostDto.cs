using CRMS.Client.ReactRedux.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Models.Dtos
{
    public class InvoicePostDto
    {
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
        public RecipientPostDto recipient { get; set; }
        public VatZone vatZone { get; set; }
        public Delivery delivery { get; set; }
        public References references { get; set; }
        public Layout layout { get; set; }
        //public Pdf pdf { get; set; }
    }
}
