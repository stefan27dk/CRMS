using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.SchedulerServices
{
    public interface ISchedulerService
    {
        Task ScheduleSubscriptionCheckAndMail();
    }
}