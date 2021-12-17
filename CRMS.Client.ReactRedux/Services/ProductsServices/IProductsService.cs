using CRMS.Client.ReactRedux.Models;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.ProductsServices
{
    public interface IProductsService
    {
        Task<int> AddProduct(JsonElement jsonProduct);
        Task<int> DeleteProductAsync(string productId);
        Task<IEnumerable> GetAllProductGroups();
        Task<List<ProductModel>> GetAllProducts();
        Task<ProductModel> GetProductById(string productId);
        Task<int> UpdateProduct(JsonElement jsonProduct, string productId);
    }
}