using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Frame.EmailService
{
    public class EmailServiceConfig : IEmailServiceConfig
    {
        // Props
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }


        // Constructor
        public EmailServiceConfig()
        {
        }



        public bool ValidateAll()
        {
            if(string.IsNullOrWhiteSpace(From))
            {
                return false;
            }
            else if (string.IsNullOrWhiteSpace(SmtpServer))
            {
                return false;
            }
            else if (string.IsNullOrWhiteSpace(Username))
            {
                return false;
            }
            else if (string.IsNullOrWhiteSpace(Password))
            {
                return false;
            }
            return true;
        }
    }
}
