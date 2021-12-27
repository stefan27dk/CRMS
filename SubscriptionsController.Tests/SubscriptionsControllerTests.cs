using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SubscriptionsController.Tests
{
    public class SubscriptionsControllerTests
    {

        // Init
        private readonly Mock<ISubscriptionsService> _mockSubService;
        private readonly CRMS.Client.ReactRedux.Controllers.SubscriptionsController _subController;


        // Constructor
        public SubscriptionsControllerTests()
        {
            // Arange
            _mockSubService = new Mock<ISubscriptionsService>();
            _subController = new CRMS.Client.ReactRedux.Controllers.SubscriptionsController(_mockSubService.Object);
        }



        
        [Fact]
        public async Task Test1()
        {
            _mockSubService.Setup(i => i.GetAllSubscriptionsAsync()).ReturnsAsync(new List<SubscriptionsModel>() { new SubscriptionsModel(), new SubscriptionsModel() }); // Specify Incoming Params and return values
             
            // Act
            var result = await _subController.GetAllSubscriptions();

            // Assert
            Assert.NotNull(result); // Is it Null
            Assert.IsType<List<SubscriptionsModel>>(result); // Is it Type SubscriptionModel
        }
    }
   
}
