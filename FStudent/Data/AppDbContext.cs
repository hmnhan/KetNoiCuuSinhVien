using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FStudent.Models;

namespace FStudent.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
            public DbSet<Gender> Gender { get; set; }
            public DbSet<Province> Province { get; set; }
            public DbSet<District> District { get; set; }
            public DbSet<AddressType> AddressType { get; set; }
            public DbSet<Profile> Profile { get; set; }
            public DbSet<Address> Address { get; set; }
            public DbSet<Specialization> Specialization { get; set; }
            public DbSet<Workplace> Workplace { get; set; }
            public DbSet<WorkingInfor> WorkingInfor { get; set; }
            public DbSet<EducationType> EducationType { get; set; }
            public DbSet<AcademicYear> AcademicYear { get; set; }
            public DbSet<ActivityClass> ActivityClass { get; set; }
            public DbSet<LearningInfor> LearningInfor { get; set; }
            public DbSet<ProfileSecurity> ProfileSecurity { get; set; }
    }
}
