using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace CRMS.Client.ReactRedux.Overloads
{
    // == || CLASS - EconomicsHttpClientHandler || =================================================================================================
    public class EconomicsHttpClientHandler : HttpClient
    {
        //// App Secret Token - Header: = "X-AppSecretToken"
        //private static string appSecretToken = "cHHF61DJAJOuMVBMg9dyLw98MWZTVPYhuZA6VTqpmik1";
        ////private static string appSecretToken = "demo";

        //// Agreement Token - Header: = "X-AgreementGrantToken"
        //private static string agreementToken = "x9yNvdMNgzzE2QSilimoGo4pB96zoeN5sPGO6VHlrBc1";
        ////private static string agreementToken = "demo";

        //// API Address - EConomic
        //public static string eConomicsApiAddress = "https://restapi.e-conomic.com";



        // App Secret Token - Header: = "X-AppSecretToken"
        private static string appSecretToken = Startup.Configuration.GetValue<string>("Economic:appSecretToken");
        //private static string appSecretToken = "demo";

        // Agreement Token - Header: = "X-AgreementGrantToken"
        private static string agreementToken = Startup.Configuration.GetValue<string>("Economic:agreementToken");
        //private static string agreementToken = "demo";

        // API Address - EConomic
        public static string eConomicsApiAddress = Startup.Configuration.GetValue<string>("Economic:eConomicsApiAddress");


        // Constructor -----------------------------------------------------------------------------------------------------------------------------
        public EconomicsHttpClientHandler()
        {   
            // Headers
           this.DefaultRequestHeaders.Add("X-AppSecretToken", appSecretToken);
           this.DefaultRequestHeaders.Add("X-AgreementGrantToken", agreementToken);
        }
    }
}
