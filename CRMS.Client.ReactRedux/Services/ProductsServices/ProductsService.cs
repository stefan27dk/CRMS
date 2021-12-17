using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Overloads;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.ProductsServices
{
    public class ProductsService : IProductsService
    {
        // Constructor ----------------------------------------------------------------------------------------------------------------------------------------
        public ProductsService()
        {
        }


        // Get ALL - Products ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<ProductModel>> GetAllProducts()
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/Products?pagesize=1000"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync(); // Result
                        ProductsListModel productList = System.Text.Json.JsonSerializer.Deserialize<ProductsListModel>(content);
                        return productList.collection;
                    }
                    return null;
                }
            }
        }





        // Get - Product ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<ProductModel> GetProductById(string productId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Products/{productId}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync(); // Result
                        var jsonResult = JsonSerializer.Deserialize<ProductModel>(content); // Get prop from apiResponse
                        return jsonResult;
                    }
                    return null;
                }
            }
        }








        // Add - Product ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> AddProduct(JsonElement jsonProduct)
        {
            var content = new StringContent(jsonProduct.ToString(), System.Text.Encoding.UTF8, "application/json");
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/products", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }







        // Update - Product ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> UpdateProduct(JsonElement jsonProduct, string productId)
        {
            var content = new StringContent(jsonProduct.ToString(), System.Text.Encoding.UTF8, "application/json");
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PutAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Products/{productId}", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }










        // Get ALL - Product Groups ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<IEnumerable> GetAllProductGroups()
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/product-groups?pagesize=1000"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync(); // Result
                        var jsonResult = JsonSerializer.Deserialize<JsonElement>(content).GetProperty("collection");
                        return jsonResult.EnumerateArray();
                    }
                    return null;
                }
            }
        }









        // DELETE - Product ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> DeleteProductAsync(string productId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.DeleteAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/products/{productId}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }


    }
}
