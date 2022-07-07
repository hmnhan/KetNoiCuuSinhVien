using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class ProfileVM
    {
        public Profile Profile { get; set; }
        public IEnumerable<SelectListItem> GenderSelectList { get; set; }
        public string StatusMessage { get; set; }
    }
    public class ProfileFilter
    {
        public Guid? EduTypeId { get; set; }
        public Guid? SpcId { get; set; }
        public Guid? AcaYearId { get; set; }
        public Guid? ActClassId { get; set; }
    }
    public class LearningInforPostData
    {
        public Guid? ActClassId { get; set; }
    }
    public class WorkingInforPostData
    {
        public string WorkPlace { get; set; }
        public int StartYear { get; set; }
        public int? EndYear { get; set; }
    }
    
    public class WorkingInforPutData
    {
        public string Id { get; set; }
        public WorkingInforPostData Data { get; set; }
    }    

    public class WorkingInforVM
    {
        public WorkingInfor WorkingInfor { get; set; }
        public string Message { get; set; }
    }
    public class ProfilePostData
    {
        public ProfileData Profile { get; set; }
        public ProfileSecurityVM Security { get; set; }
    }

    public class ProfileData
    {
        /*public string Id { get; set; }*/
        /*public string Avatar { get; set; }*/
        public string FullName { get; set; }
        public string NickName { get; set; }
        public string DateOfBirth { get; set; }
        public int GenderId { get; set; }
        public string About { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Skype { get; set; }
        public string Zalo { get; set; }
        public string Facebook { get; set; }
        public string LinkedIn { get; set; }
    }
}
