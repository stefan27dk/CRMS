using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Models.Dtos;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.InvoicesServices
{
    public interface IInvoicesServices
    {
        Task<int> CreateDraftInvoiceLogAsync(InvoiceDraftLog draftLog);
        Task<int> CreateInvoiceDraftsFromJsonAsync(JsonElement jsonDrafts, string userEmail);
        Task<List<InvoicePostDto>> CreateInvoiceDraftsFromSubscriptionsAsync(List<SubscriptionsModel> subscriptions);
        Task<int> DeleteInvoiceDraftAsync(int draftId);
        Task<List<InvoiceDraftLog>> GetAllDraftInvoiceLogsAsync();
        Task<List<InvoiceModel>> GetAllFullInvoiceDraftsAsync();
        Task<InvoiceesListModel> GetAllInvoiceDraftsAsync();
        Task<InvoiceDraftLog> GetDraftInvoiceLogByInvoiceIdAsync(int invoiceDraftId);
        Task<InvoiceModel> GetInvoiceDraftByIdAsync(int draftId);
        Task<List<string>> SendAllInvoicesAsync(string userEmail);
    }
}