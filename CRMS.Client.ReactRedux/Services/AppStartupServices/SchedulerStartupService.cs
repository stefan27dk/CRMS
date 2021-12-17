using CRMS.Client.ReactRedux.Controllers;
using CRMS.Client.ReactRedux.Services.EmailServices;
using CRMS.Client.ReactRedux.Services.SchedulerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.AppStartupServices
{
    public class SchedulerStartupService : IHostedService, ISchedulerStartupService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly IHostApplicationLifetime _hostAppLifetime;


        // Cosntructor ----------------------------------------------------------------------------------------
        public SchedulerStartupService(IConfiguration configuration, IServiceProvider serviceProvider, IHostApplicationLifetime hostAppLifetime)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _hostAppLifetime = hostAppLifetime;
        }



        private void RunShceduler()
        {
            while(_configuration["BaseUrl"] == "")
            {
              Thread.Sleep(10000);
            }

            using var scope = _serviceProvider.CreateScope();
            var shcedulerService = scope.ServiceProvider.GetRequiredService<ISchedulerService>();
            //var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            //await shcedulerService.ScheduleTask(emailService.SendToAllMails(), configuration.GetValue<int>("InvoicementNotificationSettings:ExecutionOclock"));
            shcedulerService.ScheduleSubscriptionCheckAndMail();
        }



        public Task StartAsync(CancellationToken cancellationToken)
        {
            _hostAppLifetime.ApplicationStarted.Register(RunShceduler);
            return Task.CompletedTask;
        }



        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
