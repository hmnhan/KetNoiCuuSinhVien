#pragma checksum "D:\Github\FStudent\FStudent\Views\Home\Scripts\IndexScripts.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "32e3fd172b20fd4641b43ece97dbe822890dc7df"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_Scripts_IndexScripts), @"mvc.1.0.view", @"/Views/Home/Scripts/IndexScripts.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\Github\FStudent\FStudent\Views\_ViewImports.cshtml"
using FStudent;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Github\FStudent\FStudent\Views\_ViewImports.cshtml"
using FStudent.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"32e3fd172b20fd4641b43ece97dbe822890dc7df", @"/Views/Home/Scripts/IndexScripts.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ed57bce45706207250efc689fef20c172b31a2fd", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Scripts_IndexScripts : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("name", "_GetFunction", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("name", "_SplitPage", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "32e3fd172b20fd4641b43ece97dbe822890dc7df3621", async() => {
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper.Name = (string)__tagHelperAttribute_0.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r\n");
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "32e3fd172b20fd4641b43ece97dbe822890dc7df4737", async() => {
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_PartialTagHelper.Name = (string)__tagHelperAttribute_1.Value;
            __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral(@"
<script>
    $(document).ready(function () {
        //Load searchselectlist
        disable(1);
        disable(2);
        loadGender();
        getDetail();
        loadSpecializationFilter();
        loadEducationTypeFilter();
    });


    function showMessage(str) {
        $('#message').html(str);
    }

    function getDetail() {
        detailProfile();
        detailProfileSecurity();
        detailWorking();
    }

    function detailProfile() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getdetail"",
            success: function (result) {
                if (result == null) {
                    showMessage(""Vui l??ng c???p nh???t th??ng tin ?????y ?????."");
                } else {
                    //Hien thi profile
                    var profile = result.profile;

                    //$('#modalInfor_id').val(profile.id);
                    $('#modalInfor_fullName').val(profile.fullName);
                    $('#modalInfor_n");
            WriteLiteral(@"ickName').val(profile.nickName);

                    const [day, month, year] = profile.dateOfBirth.split('/');
                    const date = `${year}-${month}-${day}`;
                    $('#modalInfor_dateOfBirth').val(date);
                    $('#modalInfor_gender').val(profile.gender.id).change();
                    $('#modalInfor_phoneNumber').val(profile.phoneNumber);
                    $('#modalInfor_email').val(profile.email);
                    $('#modalInfor_skype').val(profile.skype);
                    $('#modalInfor_zalo').val(profile.zalo);
                    $('#modalInfor_facebook').val(profile.facebook);
                    $('#modalInfor_linkedIn').val(profile.linkedIn);
                    $('#modalInfor_about').val(profile.about);

                    //Hien thi hoc van
                    $('#modalInfor_eduType').html(result.educationType.name);
                    $('#modalInfor_acaYear').html(result.academicYear.name);
                    $('#modalInfor_spc'");
            WriteLiteral(@").html(result.specialiaztion.name);
                    $('#modalInfor_actClass').html(result.activityClass.name);
                }
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });
    }

    function detailProfileSecurity() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getpfscr"",
            success: function (result) {
                if (result == null) {
                    showMessage(""Vui l??ng c???p nh???t th??ng tin ?????y ?????."");
                } else {
                    $('#privacyDateOfBirth').val(result.accessDateOfBirth).change();
                    $('#privacyPhoneNumber').val(result.accessPhoneNumber).change();
                    $('#privacyEmail').val(result.accessEmail).change();
                    $('#privacySkype').val(result.accessSkype).change();
                    $('#privacyZalo').val(result.accessZalo).change();
                    $('#privacyFacebook').v");
            WriteLiteral(@"al(result.accessFacebook).change();
                    $('#privacyLinkedIn').val(result.accessLinkedIn).change();
                    $('#privacyProfile').val(result.accessProfile).change();

                    if (result.isValidate == 1) {
                        $('#modalInfor_isValidate').html(`<b class=""text-success"">???? ???????c x??c minh</b>`);
                    } else {
                        $('#modalInfor_isValidate').html(`<b class=""text-danger"">Ch??a ???????c x??c minh</b>`);
                    }
                }
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });
    }

    function detailWorking() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getdetailwk"",
            success: function (result) {
                if (result == null) {
                    showMessage(""Vui l??ng c???p nh???t th??ng tin ?????y ?????."");
                } else {
                    var s = ``;
        ");
            WriteLiteral(@"            for (var i = 0; i < result.length; i++) {
                        s += `<div class=""form-group d-flex text-left mb-2 align-items-center"">
                                <div class=""w-25 pl-2"">
                                    <label class=""my-auto text-info"">N??i l??m vi???c</label>
                                </div>
                                <div class=""w-50"">
                                    <input type=""text"" class=""form-control form-control-sm"" value=""${result[i].workplace}"" disabled/>
                                </div>
                            </div>
                            <div class=""form-group d-flex text-left mb-2 align-items-center"">
                                <div class=""w-25 pl-2"">
                                    <label class=""my-auto text-info"">N??m b???t ?????u</label>
                                </div>
                                <div class=""w-50"">
                                    <input type=""number"" class=""form-control form-contr");
            WriteLiteral(@"ol-sm"" value=""${result[i].startYear}"" disabled/>
                                </div>
                            </div>
                            <div class=""form-group d-flex text-left mb-2 align-items-center"">
                                <div class=""w-25 pl-2"">
                                    <label class=""my-auto text-info"">N??m k???t th??c</label>
                                </div>
                                <div class=""w-50"">
                                    <input type=""number"" class=""form-control form-control-sm"" value=""${result[i].endYear}"" disabled/>
                                </div>
                            </div>
                            <div class=""form-group d-flex text-left mb-2 align-items-center"">
                                <div class=""w-25 pl-2"">
                                </div>
                                <div class=""w-50 d-flex justify-content-end"">
                                    <button type=""button"" onclick=""deleteWorking(");
            WriteLiteral(@"'${result[i].id}', '${result[i].workplace}')"" data-toggle=""modal"" data-target=""#modalDelete"" class=""btn btn-danger btn-sm w-25"">
                                        <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" fill=""currentColor"" class=""bi bi-trash3"" viewBox=""0 0 16 16"">
                                          <path d=""M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z""></path>
                                        </svg>
                                    </button>");
            WriteLiteral(@"
                                </div>
                            </div>
                            <hr>`;
                    }

                    $('#showWorking').html(s);
                }
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });
    }

    function deleteWorking(id, workplace) {
        $('#modalDelete_Id').val(id);
        $('#modalDelete_NameWorking').html(workplace);
    }

    function deleteConfirm() {
        $.ajax({
            type: ""DELETE"",
            url: ""/api/capnhatthongtinapi/deletewk?id="" + $('#modalDelete_Id').val(),
            success: function (result) {
                detailWorking();
                showMessage(result.message);
            },
            error: function () {
                showMessage(""Api l???i"");
            }
        });
    }

    function activeEdit(control) {
        active(control);
        var s = `<button type=""button"" onclick=""cancel(${");
            WriteLiteral(@"control})"" class=""btn btn-danger w-25 mr-2"">H???y b???</button><button type=""button"" onclick=""update(${control})"" class=""btn btn-primary w-25"">L??u</button>`;
        $('#changeButton' + control).html(s);

    }

    function cancel(control) {
        disable(control);
        var s = `<button type=""button"" onclick=""activeEdit(${control})"" class=""btn btn-info w-25"">Ch???nh s???a</button>`;
        $('#changeButton' + control).html(s);
    }

    function update(control) {
        switch (control) {
            case 1:
                createProfile();
                break;
            case 2:
                createLearningInfor();
                break;
            case 3:
                createWorkingInfor();
                break;
        }
        disable(control);
        var s = `<button type=""button"" onclick=""activeEdit(${control})"" class=""btn btn-info w-25"">Ch???nh s???a</button>`;
        $('#changeButton' + control).html(s);
    }

    function createProfile() {
        var fullName =");
            WriteLiteral(@" $('#modalInfor_fullName').val();
        var nickName = $('#modalInfor_nickName').val();
        var dateOfBirth = $('#modalInfor_dateOfBirth').val();
        var gender = $('#modalInfor_gender').val();
        var phoneNumber = $('#modalInfor_phoneNumber').val();
        var email = $('#modalInfor_email').val();
        var skype = $('#modalInfor_skype').val();
        var zalo = $('#modalInfor_zalo').val();
        var facebook = $('#modalInfor_facebook').val();
        var linkedIn = $('#modalInfor_linkedIn').val();
        var about = $('#modalInfor_about').val();

        //Quyen rieng tu
        var privacyProfile = $('#privacyProfile').val();
        var privacyDateOfBirth = $('#privacyDateOfBirth').val();
        var privacyPhoneNumber = $('#privacyPhoneNumber').val();
        var privacyEmail = $('#privacyEmail').val();
        var privacySkype = $('#privacySkype').val();
        var privacyZalo = $('#privacyZalo').val();
        var privacyFacebook = $('#privacyFacebook').val();");
            WriteLiteral(@"
        var privacyLinkedIn = $('#privacyLinkedIn').val();


        var profile = { ""fullName"": fullName, ""nickName"": nickName, ""dateOfBirth"": dateOfBirth, ""genderId"": gender, ""about"": about, ""phoneNumber"": phoneNumber, ""email"": email, ""skype"": skype, ""zalo"": zalo, ""facebook"": facebook, ""linkedIn"": linkedIn };
        var profileSecurity = { ""accessProfile"": privacyProfile, ""accessDateOfBirth"": privacyDateOfBirth, ""accessPhoneNumber"": privacyPhoneNumber, ""accessEmail"": privacyEmail, ""accessSkype"": privacySkype, ""accessZalo"": privacyZalo, ""accessFacebook"": privacyFacebook, ""accessLinkedIn"": privacyLinkedIn };
        var postData = { ""profile"": profile, ""security"": profileSecurity };

        if (fullName == """" || nickName == """" || dateOfBirth == """" || gender == """") {
            return false;
        }


        //Post data
        $.ajax({
            type: ""POST"",
            url: ""/api/capnhatthongtinapi/createpf"",
            dataType: 'json',
            data: JSON.stringify(postData),");
            WriteLiteral(@"
            contentType: 'application/json',
            success: function (result) {
                showMessage(result.message);
                detailProfile();
                detailProfileSecurity();
            },
            error: function (result) {
                showMessage(result.message);
            },
        });
    }

    function createLearningInfor() {
        var actClassId = $('#modalFilter_ActivityClass').val();

        if (actClassId == -1 || actClassId == null) {
            return false;
        }

        var obj = { ""actClassId"": actClassId };

        //Post data
        $.ajax({
            type: ""POST"",
            url: ""/api/capnhatthongtinapi/createli"",
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            success: function (result) {
                showMessage(result.message);
                detailProfile();
                detailProfileSecurity();
            },
    ");
            WriteLiteral(@"        error: function (result) {
                showMessage(result.message);
            },
        });
    }

    function createWorkingInfor() {
        var obj = { ""workPlace"": $('#createName').val(), ""startYear"": parseInt($('#createStartYear').val()), ""endYear"": $('#createEndYear').val() == """" ? null : parseInt($('#createEndYear').val()) };

        //Post data
        $.ajax({
            type: ""POST"",
            url: ""/api/capnhatthongtinapi/createwk"",
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            success: function (result) {
                showMessage(result.message);
                detailWorking();
            },
            error: function (result) {
                showMessage(result.message);
            },
        });
    }

    function active(control) {
        switch (control) {
            case 1:
                $(""#formProfile input"").prop('disabled', false);
                $(");
            WriteLiteral(@"""#formProfile select"").prop('disabled', false);
                $(""#formProfile textarea"").prop('disabled', false);
                break;
            case 2:
                $(""#formLearning select"").prop('hidden', false);
                break;
            case 3:
                var s = `<div class=""form-group d-flex text-left mb-2 align-items-center"">
                                <div class=""w-25 pl-2"">
                                    <label class=""my-auto"">T??n doanh nghi???p</label>
                                </div>
                                <div class=""w-50 pl-2"">
                                    <input id=""createName"" type=""text"" class=""form-control form-control-sm""/>
                                </div>
                            </div>
                            <div class=""form-group d-flex text-left mb-2 align-items-center"">
                                    <div class=""w-25 pl-2"">
                                        <label class=""my-auto"">N??m b???t ?????u</");
            WriteLiteral(@"label>
                                    </div>
                                    <div class=""w-50 pl-2"">
                                        <input id=""createStartYear"" type=""text"" class=""form-control form-control-sm""/>
                                    </div>
                                </div>
                            <div class=""form-group d-flex text-left mb-2 align-items-center"">
                                    <div class=""w-25 pl-2"">
                                        <label class=""my-auto"">N??m k???t th??c</label>
                                    </div>
                                    <div class=""w-50 pl-2"">
                                        <input id=""createEndYear"" type=""text"" class=""form-control form-control-sm""/>
                                    </div>
                                </div>`;
                $(""#inputForWorking"").html(s);
                break;
        }
    }

    function disable(control) {
        switch (control) {
    ");
            WriteLiteral(@"        case 1:
                $(""#formProfile input"").prop('disabled', true);
                $(""#formProfile select"").prop('disabled', true);
                $(""#formProfile textarea"").prop('disabled', true);
                break;
            case 2:
                $(""#formLearning select"").prop('hidden', true);
                break;
            case 3:
                $(""#inputForWorking"").html("""");
                break;
        }
    }

    function loadGender() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getgender"",
            success: function (result) {
                var s = `<option value=""-1"" selected disable>--Gi???i t??nh--</option>`;
                for (var i = 0; i < result.length; ++i) {
                    s += `<option value=""${result[i].id}"">${result[i].shortDesc}</option>`;
                }

                $('#modalInfor_gender').html(s);
            },
            error: function () {
                $('#message').");
            WriteLiteral(@"html(""Api l???i"");
            }
        });

    }

    //Load Filter
    function loadSpecializationFilter() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getspc"",
            success: function (result) {
                var s = `<option value=""-1"" selected>--T???t c???--</option>`;
                for (var i = 0; i < result.length; ++i) {
                    s += `<option value=""${result[i].id}"">${result[i].name}</option>`;
                }

                $('#modalFilter_Specialization').html(s);
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });

    }

    function loadEducationTypeFilter() {
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getet"",
            success: function (result) {
                var s = `<option value=""-1"" selected>--T???t c???--</option>`;
                for (var i = 0; i < result.length; ++i) {
             ");
            WriteLiteral(@"       s += `<option value=""${result[i].id}"">${result[i].name}</option>`;
                }

                $('#modalFilter_EducationType').html(s);
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });

    }

    function loadAcademicYearFilter() {
        var eduTypeId = $('#modalFilter_EducationType').val();
        $.ajax({
            type: ""GET"",
            url: ""/api/capnhatthongtinapi/getay?eduTypeId="" + eduTypeId,
            success: function (result) {
                var s = `<option value=""-1"" selected>--T???t c???--</option>`;
                for (var i = 0; i < result.length; ++i) {
                    s += `<option value=""${result[i].id}"">${result[i].name} - ${result[i].startYear}</option>`;
                }

                $('#modalFilter_AcademicYear').html(s);
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });

    }

    /");
            WriteLiteral(@"/SelectFilter Onchange
    $('#modalFilter_EducationType').change(function () {
        if ($('#modalFilter_EducationType').val() != -1) {
            $('#modalFilter_AcademicYear').removeAttr('disabled');
            loadAcademicYearFilter();
            if ($('#modalFilter_Specialization').val() != -1) {

            }
        } else {
            $('#modalFilter_AcademicYear').html('<option value=""-1"" selected>--T???t c???--</option>');
            $('#modalFilter_AcademicYear').attr('disabled', 'disabled');
        }
    });

    $('#modalFilter_AcademicYear').change(function () {
        changeStageActivityClass();
    });
    $('#modalFilter_Specialization').change(function () {
        changeStageActivityClass();
    });

    function changeStageActivityClass() {
        if ($('#modalFilter_AcademicYear').val() != -1 && $('#modalFilter_Specialization').val() != -1 && $('#modalFilter_EducationType').val() != -1) {
            $('#modalFilter_ActivityClass').removeAttr('disabled');

");
            WriteLiteral(@"            var acaYearId = $('#modalFilter_AcademicYear').val();
            var spcId = $('#modalFilter_Specialization').val();
            $.ajax({
                type: ""GET"",
                url: ""/api/capnhatthongtinapi/getac?acaYearId="" + acaYearId + ""&spcId="" + spcId,
                success: function (result) {
                    var s = `<option value=""-1"" selected>--T???t c???--</option>`;
                    for (var i = 0; i < result.length; ++i) {
                        s += `<option value=""${result[i].id}"">${result[i].name}</option>`;
                    }

                    $('#modalFilter_ActivityClass').html(s);
                },
                error: function () {
                    $('#message').html(""Api l???i"");
                }
            });
        } else {
            $('#modalFilter_ActivityClass').attr('disabled', 'disabled');
            $('#modalFilter_ActivityClass').html('<option value=""-1"" selected>--T???t c???--</option>');
        }
    }
</script>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
