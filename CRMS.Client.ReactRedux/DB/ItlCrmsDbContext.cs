using CRMS.Client.ReactRedux.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.DB
{
    // == || CLASS - ItlCrmsDbContext || ============================================================================================================================== 
    public class ItlCrmsDbContext : DbContext, IItlCrmsDbContext
    {
        // Constructor ------------------------------------------------------------------------------------------------------------------------------------------------
        public ItlCrmsDbContext(DbContextOptions<ItlCrmsDbContext> options) : base(options)
        {
        }


        // On Model Creating
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Domain
            modelBuilder.Entity<CustomersDomainsModel>(d =>
            {
                d.HasKey(p => p.Id);
                d.Property(p => p.DomainName).HasColumnType("nvarchar(70)").IsRequired();
                d.HasIndex(e => e.DomainName).IsUnique();
                d.ToTable("Domains");
            });

            // Subscriptions
            modelBuilder.Entity<SubscriptionsModel>(c =>
            {
                c.HasKey(p => p.Id);
                c.Property(p => p.DomainId).IsRequired();
                c.Property(p => p.Description).HasColumnType("nvarchar(80)");
                c.HasOne<CustomersDomainsModel>()
                    .WithMany()
                    .HasForeignKey(c => c.DomainId);
                c.ToTable("Subscriptions");
            });


            // Mails
            modelBuilder.Entity<NotificationMailsModel>(m =>
            {
                m.HasKey(p => p.Id);
                m.Property(p => p.Email).HasColumnType("nvarchar(70)").IsRequired();
                m.HasIndex(e => e.Email).IsUnique();
                m.ToTable("NotificationMails");
            });



            // InvoiceDraftLog
            modelBuilder.Entity<InvoiceDraftLog>(m =>
            {
                m.HasKey(p => p.Id);
                m.Property(p => p.InvoiceDraftId).IsRequired();
                m.Property(p => p.UserEmail).HasColumnType("nvarchar(70)").IsRequired();
                m.ToTable("InvoiceDraftLog");
            });
            base.OnModelCreating(modelBuilder);
        }


        // DB Sets
        public DbSet<SubscriptionsModel> Subscriptions { get; set; }
        public DbSet<CustomersDomainsModel> CustomersDomains { get; set; }
        public DbSet<NotificationMailsModel> NotificationMails { get; set; }
        public DbSet<InvoiceDraftLog> InvoiceDraftLog { get; set; }



        // Save Changes
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }

    }
}
