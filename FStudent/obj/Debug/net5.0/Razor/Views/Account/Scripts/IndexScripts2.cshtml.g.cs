#pragma checksum "D:\Github\FStudent\FStudent\Views\Account\Scripts\IndexScripts2.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2bd4bc6724022158f6ec9f19a3863d843cf366b8"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Account_Scripts_IndexScripts2), @"mvc.1.0.view", @"/Views/Account/Scripts/IndexScripts2.cshtml")]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"2bd4bc6724022158f6ec9f19a3863d843cf366b8", @"/Views/Account/Scripts/IndexScripts2.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ed57bce45706207250efc689fef20c172b31a2fd", @"/Views/_ViewImports.cshtml")]
    public class Views_Account_Scripts_IndexScripts2 : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
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
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "2bd4bc6724022158f6ec9f19a3863d843cf366b83641", async() => {
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
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "2bd4bc6724022158f6ec9f19a3863d843cf366b84757", async() => {
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
        $('#searchstring').keypress(function (e) {
            var key = e.which;
            if (key == 13)  // the enter key code
            {
                goToPage(1);
                return false;
            }
        });
        goToPage(1);
    });

    function goToPage(pageIndex) {
        var pageSize = $('#pagesize').val();
        var filter = $('#searchstring').val() == null ? """" : $('#searchstring').val();
        $.ajax({
            type: ""GET"",
            url: getUrl(""/api/taikhoanapi/getusers"", pageIndex, pageSize, filter),
            success: function (result) {

                var data = result.data;

                var items = data.items;
                var s = ``;
                for (var i = 0; i < items.length; i++) {
                    s += `<tr><td class=""align-middle text-center""> ${(i + 1) + (data.pageIndex - 1) * data.pageSize} </td>
                        <td class=""align-middle text-left text-br");
            WriteLiteral(@"eak"">${items[i].userName}</td>
                        <td class=""align-middle text-left text-break"">${items[i].normalizedUserName}</td>
                        <td class=""text-center align-middle"">
                            <button type=""button"" class=""btn btn-primary mr-2"" data-toggle=""modal"" data-target=""#modalEdit"" onclick=""resetPass('${items[i].id}', '${items[i].userName}')"">
                                Đổi mật khẩu
                            </button>
                        </td></tr>`;
                }
                $('#data').html(s);

                showPageScroll(data.pageIndex, data.pageCount);
                $('#resultmessage').html(`Đã hiển thị ${items.length} trong số ${data.totalRecords} kết quả`);
            },
            error: function () {
                $('#message').html(""Api lỗi"");
            }
        });
    }


    function showMessage(str) {
        $('#message').html(str);
    }

    function resetPass(id, name) {
        $('#modalEdit_Id').");
            WriteLiteral(@"val(id);
        $('#modalEdit_UserName').val(name);
    }

    function update() {
        var newPassword = $('#modalEdit_Password').val();
        var retypePassword = $('#modalEdit_RetypePassword').val();

        if (newPassword != retypePassword) {
            $('#resetMessage').html(""Mật khẩu nhập lại không trùng khớp."");
            return false;
        }
        //prepare data
        var userId = $('#modalEdit_Id').val();
        var obj = { ""userId"": userId, ""newPassword"": newPassword };

        //put data
        $.ajax({
            type: ""POST"",
            url: ""/api/taikhoanapi/resetpw"",
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            success: function (result) {
                $('#resetMessage').html(result.message);
                $('#modalEdit_Password').val("""");
                $('#modalEdit_RetypePassword').val("""");
                goToPage(1);
            },
            error: f");
            WriteLiteral("unction (result) {\r\n                showMessage(result.message);\r\n            },\r\n        });\r\n    }\r\n");
            WriteLiteral("</script>");
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
