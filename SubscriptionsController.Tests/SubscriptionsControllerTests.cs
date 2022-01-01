using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using CRMS.Client.ReactRedux.DB;
using Microsoft.EntityFrameworkCore;
using Castle.Core.Configuration;
using CRMS.Client.ReactRedux;
using Microsoft.Extensions.Configuration;

namespace SubscriptionsController.Tests
{
    public class SubscriptionsControllerTests
    {

        //// Init
        //private readonly Mock<ISubscriptionsService> _mockSubService;
        //private readonly CRMS.Client.ReactRedux.Controllers.SubscriptionsController _subController;



         

        // Constructor
        public SubscriptionsControllerTests()
        { 
        }


        //private ISubscriptionsService _subscriptionsService;

        [Fact]
        public async Task Test1()
        {
            var mockSubService = new Mock<ISubscriptionsService>();
            //mockSubService.Setup(m => m.GetAllSubscriptionsAsync()).ReturnsAsync(new List<SubscriptionsModel>());

            // Here we are "injecting" the dependencies into the AuthClient
            var _subController = new CRMS.Client.ReactRedux.Controllers.SubscriptionsController(mockSubService.Object);
            // This service call will now use the supplied (mocked) services above
            var result = await _subController.GetAllSubscriptions();

            mockSubService.Verify(b => b.GetAllSubscriptionsAsync(), Times.Once);

            Assert.NotNull(result); // Is it Null
             Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
             //Assert.Equal(System.DateTime.Now, result[0].PeriodEndDate);
        }






        //private ISubscriptionsService _subscriptionsService;

        //[Fact]
        //public async Task Test1()
        //{
        //    var services = new ServiceCollection(); // Service Collection

        //    // Db Context - Registration  
        //    services.AddDbContextPool<ItlCrmsDbContext>(options =>
        //    options.UseSqlServer(Startup.Configuration.GetConnectionString("DefaultConnection"))); // Connectionstring

        //    services.AddScoped<IItlCrmsDbContext>(provider => provider.GetService<ItlCrmsDbContext>()); // Register the IItlCrmsDbContext Db context

        //    //Subscriptions Service
        //    services.AddTransient<ISubscriptionsService, SubscriptionsService>(); // Add Service


        //    var serviceProvider = services.BuildServiceProvider(); // Build Service Provider
        //    _subscriptionsService = serviceProvider.GetService<ISubscriptionsService>(); // Get the service


        //    var result = await _subscriptionsService.GetAllSubscriptionsAsync();

        //    Assert.NotNull(result); // Is it Null
        //    Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
        //    //Assert.Equal(System.DateTime.Now, result[0].PeriodEndDate);
        //}





        //private ISubscriptionsService subscriptionsService;

        //[Fact]
        //public async Task Test1()
        //{
        //    var services = new ServiceCollection(); // Service Collection
        //    services.AddTransient<ISubscriptionsService, SubscriptionsService>(); // Add Service
        //    services.AddTransient<I, SubscriptionsService>(); // Add Service
        //    var serviceProvider = services.BuildServiceProvider(); // Build Service Provider
        //    subscriptionsService = serviceProvider.GetService<ISubscriptionsService>(); // Get the service


        //   var result =  subscriptionsService.GetAllSubscriptionsAsync();

        //    Assert.NotNull(result); // Is it Null
        //    Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
        //    //Assert.Equal(System.DateTime.Now, result[0].PeriodEndDate);
        //}



        //[Fact]
        //public async Task Test1()
        //{
        //    _mockSubService.Setup(i => i.GetSubscriptionsReadyForInvoicementAsync()).ReturnsAsync(new List<SubscriptionsModel>() { new SubscriptionsModel(), new SubscriptionsModel() }); // Specify Incoming Params and return values

        //    // Act
        //   var result = await _subController.GetAllReadyForInvoiceSubscriptions();
        //   var listResult = (List<SubscriptionsModel>)result;


        //    // Assert
        //    Assert.NotNull(result); // Is it Null
        //    Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
        //    Assert.Equal(System.DateTime.Now, listResult[0].PeriodEndDate);

        //}   


        //[Fact]
        //public async Task Test1()
        //{
        //    //arrange
        //    _mockSubService.Setup(i => i.GetSubscriptionsReadyForInvoicementAsync()).ReturnsAsync(new List<SubscriptionsModel>() { });

        //    //act
        //    var actionResult = _subController.GetAllSubscriptions().Result;
        //    var result = actionResult as OkObjectResult;
        //    var actual = result.Value as IEnumerable<SubscriptionsModel>;

        //    //assert
        //    Assert.IsType<OkObjectResult>(result);
        //    //Assert.Equal(GetSampleEmployee().Count(), actual.Count);

        //}

    }

}
