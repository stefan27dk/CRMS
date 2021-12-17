using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using System.Net.Http;
using System.Text.Json;
using CRMS.Client.ReactRedux.Overloads;
using CRMS.Client.ReactRedux.Services.ProductsServices;

namespace CRMS.Client.ReactRedux.Controllers
{
    // == || CLASS - Products || ============================================================================================================================== 
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productsService;
          
        // Constructor ----------------------------------------------------------------------------------------------------------------------------------------
        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }




        // Get ALL - Products ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productsService.GetAllProducts();
            if(products != null)
            {
                return StatusCode(200, products);
            }
               return StatusCode(500, "Server Fejl!");
        }








        // Get - Product ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet("GetProductById")]
        public async Task<IActionResult> GetProductById(string productId)
        {
            var product = await _productsService.GetProductById(productId);
            if (product != null)
            {
                return StatusCode(200, product);
            }
                return StatusCode(500, "Server Fejl!");
        }







        // Add - Product ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPost]
        [Route("AddProduct")]
        public async Task<IActionResult> AddProduct([FromBody] JsonElement jsonProduct)
        {
            var product_added = await _productsService.AddProduct(jsonProduct);
            if (product_added == 1)
            {
                return await GetAllProducts();
            }
            return StatusCode(500, "Server Fejl!");
        }






        // Update - Product ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] JsonElement jsonProduct, string productId)
        {
            var product_updated = await _productsService.UpdateProduct(jsonProduct, productId);
            if (product_updated == 1)
            {
                return StatusCode(200, new { Product = await _productsService.GetProductById(productId), Products = await _productsService.GetAllProducts()});
            }
            return StatusCode(500, $"Server Fejl! - Kunne ikke opdater Produkt med ID: {productId}");
        }






        // Delete - Product ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpDelete("DeleteProduct")]
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            var product_deleted = await _productsService.DeleteProductAsync(productId);
            if (product_deleted == 1)
            {
                return await GetAllProducts();
            }
            return StatusCode(500, $"Server Fejl! - Kunne ikke slette Product med ID: {productId}");
        }





        // Get ALL - Product Groups ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllProductGroups")]
        public async Task<IActionResult> GetAllProductGroups()
        {
            var product_groups = await _productsService.GetAllProductGroups();
            if (product_groups != null)
            {
                return StatusCode(200, product_groups);
            }
            return StatusCode(500, "Server Fejl!");
        }
    }
}
