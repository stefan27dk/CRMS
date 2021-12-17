using System.Threading;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.AppStartupServices
{
    public interface ISchedulerStartupService
    {
        Task StartAsync(CancellationToken cancellationToken);
        Task StopAsync(CancellationToken cancellationToken);
    }
}