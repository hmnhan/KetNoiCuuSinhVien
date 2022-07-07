using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface IUpdateProfile
    {
        public bool CheckValidate(AppDbContext _context, Profile profile);

        public IEnumerable<LearningInfor> GetLearningInfor(AppDbContext _context);
        public WorkingInforVM CreateWorkingInfor(AppDbContext _context, string userId, WorkingInforPostData postData);

        public IEnumerable<Profile> SearchProfiles(AppDbContext _context, string userId, string filter, ProfileFilter prfFilter);
    }
}
