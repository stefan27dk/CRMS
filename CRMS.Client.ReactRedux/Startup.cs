using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Filter;
using CRMS.Client.ReactRedux.Frame.EmailService;
using CRMS.Client.ReactRedux.MiddleWares;
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
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux
{
    // == || CLASS - Startup || ============================================================================================================================== 
    public class Startup
    {
        public static IConfiguration Configuration { get; set; }
 

        // Constructor -----------------------------------------------------------------------------------------------------------------------------
        public Startup(IConfiguration configuration, Microsoft.Extensions.Hosting.IHostEnvironment env)
        {
            Configuration = configuration;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();      
        }






        // ConfigureServices ----------------------------------------------------------------------------------------------------------------------- 
        public void ConfigureServices(IServiceCollection services)// This method gets called by the runtime. Use this method to add services to the container.
        {         
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


                     


            // Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CRMS.Client.ReactRedux", Version = "v1" });
            });



            // SPA Static files
            services.AddSpaStaticFiles(configuration =>  // In production, the React files will be served from this directory
            {
                configuration.RootPath = "ClientApp/build";
            });


            // Startup Services - run on app startup
            services.AddHostedService<SchedulerStartupService>();

          


            //services.AddCors(options =>
            //options.AddPolicy("AllowAll", p => p.SetIsOriginAllowed(origin => true)
            //                                    .WithMethods("POST")
            //                                    .WithHeaders("name")));

        }








        // Configure ---------------------------------------------------------------------------------------------------------------------------------- 
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        {
            app.UseMiddleware(typeof(HttpContextAccessorMiddleware));

            // Development Mode
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();    
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CRMS.Client.ReactRedux"));

            app.UseHsts(); // Allow HTTPS
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();


            // Ensure DB Created
            Initialize(app);


            // Log In
            app.UseAuthentication(); // UseAuthentication SHOULD ALWAYS BE BEFORE Authorization
            app.UseAuthorization();



            //// If Specific path load content from another path
            //app.Use(async (context, next) =>
            //{
            //    var url = context.Request.Path.Value;
            //    // Rewrite to index
            //    if (url.Contains("/Account/AccessDenied"))
            //    {
            //        // rewrite and continue processing
            //        context.Response.StatusCode = 401;
            //    }
            //    await next();
            //});

            //app.Run(context =>
            //{
            //    if (context.User.Identity.IsAuthenticated != true)
            //    {
            //        context.Response.StatusCode = 401;
            //    }

            //    return Task.CompletedTask;
            //});


            //app.UseWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
            //{
            //    // If Specific path load content from another path
            //    app.Use(async (context, next) =>
            //    {
            //        var url = context.Request.Path.Value;
            //        // Rewrite to index
            //        if (url.Contains("/Account/AccessDenied"))
            //        {
            //            // rewrite and continue processing
            //            context.Response.StatusCode = 401;
            //        }
            //        await next();
            //    });

            //    //app.Run(async context =>
            //    //{

            //    //    if (!context.User.Identity.IsAuthenticated)
            //    //    {
            //    //        context.Response.StatusCode = 401;
            //    //    }
            //    //});
            //});


            // Use Endpoints
            app.UseEndpoints(endpoints =>
            {
               
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                endpoints.MapGet("/Account/AccessDenied", async context =>
                {
                    context.Response.StatusCode = 401;
                });
            });





          




            //// Use Spa
            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseReactDevelopmentServer(npmScript: "start");
            //    }
            //});



            app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
            {
                builder.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";

                    if (env.IsDevelopment())
                    {
                        spa.UseReactDevelopmentServer(npmScript: "start");
                    }
                });
            });
        }





        public static async void Initialize(IApplicationBuilder app)
        {
            // Ensure DB Created  & Create Admin
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                //// Ensrue Db Created
                //var context = serviceScope.ServiceProvider.GetRequiredService<ItlCrmsDbContext>();
                //await context.Database.MigrateAsync();

                //var identityContext = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();
                //await identityContext.Database.MigrateAsync();

                // Create Admin
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                var user = new ApplicationUser(); // Create the User
                user.SetUserData("ITL", "CRMS", "a@a.dk", null, null, "123456");
                await userManager.CreateAsync(user);
          

                // Create Roles
                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                // Admin
                var adminRole = new IdentityRole { Name = "admin" };  
                await roleManager.CreateAsync(adminRole);
                //User
                var userRole = new IdentityRole { Name = "user" };  
                await roleManager.CreateAsync(userRole);
                // Guest
                var guestRole = new IdentityRole { Name = "guest" };
                await roleManager.CreateAsync(guestRole);


                // Add Admin User to Admin ROle
                await userManager.AddToRoleAsync(user, "admin");
            }
        }
    }
}
