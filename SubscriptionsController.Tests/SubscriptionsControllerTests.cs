using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Filter;
using CRMS.Client.ReactRedux.Frame.EmailService;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Models.IdentityModels;
using CRMS.Client.ReactRedux.Services.AppStartupServices;
using CRMS.Client.ReactRedux.Services.ConfigurationServices;
using CRMS.Client.ReactRedux.Services.CustomersServices;
using CRMS.Client.ReactRedux.Services.DomainsServices;
using CRMS.Client.ReactRedux.Services.EmailServices;
using CRMS.Client.ReactRedux.Services.InvoicesServices;
using CRMS.Client.ReactRedux.Services.NotificationMailsServices;
using CRMS.Client.ReactRedux.Services.ProductsServices;
using CRMS.Client.ReactRedux.Services.SchedulerServices;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace SubscriptionsController.Tests
{
    public class SubscriptionsControllerTests
    {
        public static IConfiguration Configuration { get; set; }


         // Constructor
        public SubscriptionsControllerTests()
        {
            var builder = new ConfigurationBuilder()
                       .SetBasePath(Directory.GetCurrentDirectory()) // requires Microsoft.Extensions.Configuration.Json
                       .AddJsonFile("appsettings.json") // requires Microsoft.Extensions.Configuration.Json
                       .AddEnvironmentVariables(); // requires Microsoft.Extensions.Configuration.EnvironmentVariables
            Configuration = builder.Build();
        }


     

        // Test 1
        [Fact]
        public async Task GetAllSubscriptions()
        {
            var serviceProvider = Configure();
            var subService = serviceProvider.GetService<ISubscriptionsService>(); // Get Service
            var subController = new CRMS.Client.ReactRedux.Controllers.SubscriptionsController(subService);

            // Act
            var result = await subController.GetAllSubscriptions();

            // Assert
            Assert.NotNull(result); // Is it Null
            Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
            //Assert.Equal(System.DateTime.Now, result[0].PeriodEndDate);
        }




              
        // Add All Services and return Buiilder
        private ServiceProvider Configure()
        {
            var services = new ServiceCollection(); // New Service Collection

            //services.AddDntScheduler( options)
            // Config
            services.AddSingleton<IConfiguration>(Configuration);
            //services.AddHttpContextAccessor();

            // Subscription Status
            services.AddScoped<ISubscriptionsService, SubscriptionsService>();

            // Customers Services
            services.AddScoped<ICustomersService, CustomersService>();

            // Product Services
            services.AddScoped<IProductsService, ProductsService>();

            // Domains Services
            services.AddScoped<IDomainsService, DomainsService>();

            // Appsettings Config Services
            services.AddScoped<IAppsettingsConfigurationService, AppsettingsConfigurationService>();


            // Email Service   
            services.AddSingleton(Configuration.GetSection("EmailConfigSettings").Get<EmailServiceConfig>());
            services.AddScoped<IEmailServiceConfig, EmailServiceConfig>();
            services.AddScoped<INotificationMailsService, NotificationMailsService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddSingleton<ISchedulerService, SchedulerService>();


            // Db Context - Registration  
            services.AddDbContextPool<ItlCrmsDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))); // Connectionstring

            services.AddScoped<IItlCrmsDbContext>(provider => provider.GetService<ItlCrmsDbContext>()); // Register the IItlCrmsDbContext Db context

            // Identity - Db Context - Registration  
            services.AddDbContextPool<IdentityContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))); // Connectionstring

            // Invoice Service
            services.AddScoped<IInvoicesServices, InvoicesServices>();

            // Unit of Work - Registration 
            services.AddScoped<UnitOfWorkFilter>();
            services.AddControllers(config => { config.Filters.AddService<UnitOfWorkFilter>(); });  // UnitOfWork for all Controllers



            // Log In
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

            }).AddEntityFrameworkStores<IdentityContext>().AddDefaultTokenProviders(); // AddDefaultTokenProviders is used for the Update Log In Password etc.




            // Log In
            // Make all Controllers protected by default so only Authorized Users can accsess them, for Anonymouse Users use [AlloAnonymouse] over the controllers.
            services.AddMvc(options => {
                var policy = new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .Build();
                options.Filters.Add(new AuthorizeFilter(policy));

            }).AddXmlSerializerFormatters();

               

         

            // Startup Services - run on app startup
            services.AddHostedService<SchedulerStartupService>();

            var serviceProvider = services.BuildServiceProvider(); // Build Service

            return serviceProvider;
        }
       
    }
}
