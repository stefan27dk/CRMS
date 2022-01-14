using CRMS.Client.ReactRedux.Frame.EmailService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.ConfigurationServices
{
    public class AppsettingsConfigurationService : IAppsettingsConfigurationService
    {
        // Constructor
        public AppsettingsConfigurationService()
        {
        }



        // ===== Set CVR API Address =====================================================================
        public async Task<int> SetCvrApiAddressAsync(string cvrApiAddress)
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            jsonObj.CvrApiAddress = cvrApiAddress;
            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(path, output);
            return 1;
        }



        // ===== Get CVR API Address=====================================================================
        public async Task<JsonElement> GetCvrApiAddressAsync()
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            var jsonObj = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(json); // Get prop from apiResponse
            return jsonObj.GetProperty("CvrApiAddress");
        }



        // ===== Set Server Email Settings || POST || =====================================================================
        public async Task<int> SetServerEmailSettingsAsync(EmailServiceConfig emailSettingsObj)
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            jsonObj.EmailConfigSettings.From = emailSettingsObj.From;
            jsonObj.EmailConfigSettings.SmtpServer = emailSettingsObj.SmtpServer;
            jsonObj.EmailConfigSettings.Port = emailSettingsObj.Port;
            jsonObj.EmailConfigSettings.Username = emailSettingsObj.Username;
            jsonObj.EmailConfigSettings.Password = emailSettingsObj.Password;
            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(path, output);
            return 1;
        }



        // ===== Get Server Email Settings || POST || =====================================================================
        public async Task<JsonElement> GetServerEmailSettingsAsync()
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            var jsonObj = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(json); // Get prop from apiResponse
            return jsonObj.GetProperty("EmailConfigSettings");
        }




        // Notifications for ready subscription for invoicement ############################################################################################################
        // ===== Get Notification days before ready for Invoicement || GET || =====================================================================
        public async Task<int> GetNotificationDaysAsync()
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            return (int)jsonObj.InvoicementNotificationSettings.DaysBefore;
        }




        // ===== Set Notification days || POST || =====================================================================
        public async Task<int> SetNotificationDaysAsync(int notificationDays)
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            jsonObj.InvoicementNotificationSettings.DaysBefore = notificationDays;
            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(path, output);
            return 1;
        }





        // ConnectionString ######################################################################################################################
        // ===== Get DB Connectionstring || GET || =====================================================================
        public async Task<string> GetDbConStringAsync()
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            return (string)jsonObj.ConnectionStrings.DefaultConnection;
        }





        // ===== Set DB Connectionstring || POST || =====================================================================
        public async Task<int> SetDbConStringAsync(string conString)
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            jsonObj.ConnectionStrings.DefaultConnection = conString;
            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(path, output);
            return 1;
        }






        // Invoice Token ######################################################################################################################
        // ===== Get Invoice Token || GET || =====================================================================
        public async Task<string> GetInvoiceTokenAsync()
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            return (string)jsonObj.InvoicementNotificationSettings.SendInvoicesToken;
        }




        // =====  Set Invoice Token || SET || =====================================================================
        public async Task<int> SetInvoiceTokenAsync(string token)
        {
            var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            var json = await System.IO.File.ReadAllTextAsync(path);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            jsonObj.InvoicementNotificationSettings.SendInvoicesToken = token;
            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            await System.IO.File.WriteAllTextAsync(path, output);
            return 1;
        }





        // =====  Generate Invoice Token || SET || =====================================================================
        public Task<string> GenerateInvoiceTokenAsync()
        {
            return Task.FromResult<string>(Guid.NewGuid().ToString("N"));
        }
    }
}










//// ===== Set DB Connectionstring || POST || =====================================================================
//[HttpPut]
//[Route("SetDbConString")]
//public async Task<IActionResult> SetDbConString(string conString)
//{
//    if (!string.IsNullOrWhiteSpace(conString))
//    {
//        var path = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
//        var json = await System.IO.File.ReadAllTextAsync(path);
//        dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
//        jsonObj.ConnectionStrings.DefaultConnection = conString;
//        string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
//        await System.IO.File.WriteAllTextAsync(path, output);
//        return await RestartServer();
//        //_configuration["ConnectionStrings:DefaultConnection"] = conString;
//        //CRMS.Client.ReactRedux.Startup.Configuration["ConnectionStrings:DefaultConnection"] = conString;
//        //return StatusCode(201, CRMS.Client.ReactRedux.Startup.Configuration["ConnectionStrings:DefaultConnection"]);
//        //RestartServer();
//    }
//    return StatusCode(409, "[\n \"Input was null or empty\" \n]");
//}

