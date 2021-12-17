using CRMS.Client.ReactRedux.Services.EmailServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
 

namespace CRMS.Client.ReactRedux.Services.SchedulerServices
{
    public class SchedulerService : ISchedulerService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private Timer timer = null;

        // Constructor
        public SchedulerService(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
        }

        

        // Work - Method
        private async void CheckSubscriptionsAndSendMails()
        {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            await emailService.SendToAllMails();
        }


        //https://stackoverflow.com/questions/3243348/how-to-call-a-method-daily-at-specific-time-in-c
        // https://stackoverflow.com/questions/59727799/how-to-run-net-core-ihosted-service-at-specific-time-of-the-day
        // https://stackoverflow.com/questions/18611226/c-how-to-start-a-thread-at-a-specific-time
        // https://www.c-sharpcorner.com/blogs/how-to-run-a-timer-on-specific-time-interval
 

        public async Task ScheduleSubscriptionCheckAndMail()
        {
            var oClock = _configuration.GetValue<int>("InvoicementNotificationSettings:ExecutionOclock");
            await Task.Run(() =>
            {
                CheckSubscriptionsAndSendMails();
                var tomorrow = DateTime.Now.AddDays(1);
                var nextTime = new DateTime(tomorrow.Year, tomorrow.Month, tomorrow.Day, oClock, 0, 0);
                this.timer = new System.Threading.Timer(x => { CheckSubscriptionsAndSendMails(); }, null, nextTime - DateTime.Now, new TimeSpan(24, 0, 0));
            });
        }
    }
}
