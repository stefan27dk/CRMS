using CRMS.Client.ReactRedux.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.DB
{
    public interface IItlCrmsDbContext
    {
        DbSet<TEntity> Set<TEntity>() where TEntity : class;

        // Entry
        EntityEntry<TEntity> Entry<TEntity>([NotNullAttribute] TEntity entity) where TEntity : class;

        Task<int> SaveChangesAsync();
    }
}