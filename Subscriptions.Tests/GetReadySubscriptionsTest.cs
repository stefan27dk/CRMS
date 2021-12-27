using CRMS.Client.ReactRedux.Controllers;
using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Subscriptions.Tests
{
    [TestClass]
    public class GetReadySubscriptionsTest
    {
        [TestMethod]
        public async Task TestMethod1()
        {
            //List<SubscriptionsModel> list = new List<SubscriptionsModel>();
            //var mock = new Mock<ISubscriptionsService>();
            //mock.Setup(i => i.GetSubscriptionsReadyForInvoicementAsync()).ReturnsAsync(list); // Specify Incoming Params and return values
            //var result = await mock.Object.GetSubscriptionsReadyForInvoicementAsync();

            //2
            //var dbContextMock = new Mock<IItlCrmsDbContext>();
            //var configMock = new Mock<IConfiguration>();
            //var sut = new SubscriptionsService(dbContextMock.Object, configMock.Object);

            //var result = await sut.GetSubscriptionsReadyForInvoicementAsync();

            //// 4
            ////var result = await mock.Object.GetSubscriptionsReadyForInvoicementAsync();

            //System.Diagnostics.Debug.WriteLine(result[0].PeriodEndDate);
            //Assert.AreEqual(System.DateTime.Today, result[0].PeriodEndDate);





            ///////////////////////////////////////////////////
            var mockSubService = new Mock<ISubscriptionsService>();

            mockSubService.Setup(i => i.GetAllSubscriptionsAsync()).ReturnsAsync(new List<SubscriptionsModel>() { new SubscriptionsModel(), new SubscriptionsModel() }); // Specify Incoming Params and return values

            // Arange
            var subController = new SubscriptionsController(mockSubService.Object);


            // Act
            var result = await subController.GetAllSubscriptions();

            // Arange
            var viewResult = Assert.<ViewResult>(result);
            var employees = Assert.IsType<List<Employee>>(viewResult.Model);
            Assert.Equal(2, employees.Count);
        }



    }
}
