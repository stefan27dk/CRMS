using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.MiddleWares
{
    public class HttpContextAccessorMiddleware
    {
        private readonly RequestDelegate _requestDelegate;
        private readonly IConfiguration _configuration;

        public HttpContextAccessorMiddleware(RequestDelegate requestDelegate, IConfiguration configuration)
        {
            _requestDelegate = requestDelegate;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context)
        {
            await _requestDelegate(context);
            _configuration["BaseUrl"] = context.Request.Host.Value;
        }
    }
}
