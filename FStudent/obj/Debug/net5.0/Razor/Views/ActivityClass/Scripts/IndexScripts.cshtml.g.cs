#pragma checksum "D:\Github\FStudent\FStudent\Views\ActivityClass\Scripts\IndexScripts.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "8d59bbc2d99f0869feafcb8a3eea3adfb2b986fb"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_ActivityClass_Scripts_IndexScripts), @"mvc.1.0.view", @"/Views/ActivityClass/Scripts/IndexScripts.cshtml")]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"8d59bbc2d99f0869feafcb8a3eea3adfb2b986fb", @"/Views/ActivityClass/Scripts/IndexScripts.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ed57bce45706207250efc689fef20c172b31a2fd", @"/Views/_ViewImports.cshtml")]
    public class Views_ActivityClass_Scripts_IndexScripts : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
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
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "8d59bbc2d99f0869feafcb8a3eea3adfb2b986fb3666", async() => {
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
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("partial", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.SelfClosing, "8d59bbc2d99f0869feafcb8a3eea3adfb2b986fb4782", async() => {
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
        //Load searchselectlist
        loadAcademicYearSelectList();
        loadSpecializationSelectList();
        goToPage(1);
        
        
    });

    function getUrlActClass(pageIndex) {
        var pageSize = $('#pagesize').val();
        var spcId = ($('#searchwithspc').val() == -1 || $('#searchwithspc').val() == null) ? '' : '&specializationId=' + $('#searchwithspc').val();
        var eduTypeId = ($('#searchwithay').val() == -1 || $('#searchwithay').val() == null) ? '' : '&acaYearId=' + $('#searchwithay').val();
        var searchstring = $('#searchstring').val() != """" ? '&filter=' +  $('#searchstring').val() : '';

        return '/api/lopsinhhoatapi/getall'
            + '?pageIndex=' + pageInd");
            WriteLiteral(@"ex
            + '&pageSize=' + pageSize
            + spcId
            + eduTypeId
            + searchstring;
    }

    function goToPage(pageIndex) {
        $.ajax({
            type: ""GET"",
            url: getUrlActClass(pageIndex),
            success: function (result) {
                //$('#message').html(JSON.stringify(result));

                var data = result.data;

                var items = data.items;
                var s = ``;
                for (var i = 0; i < items.length; i++) {
                    s += `<tr><td class=""align-middle text-center""> ${(i + 1) + (data.pageIndex - 1) * data.pageSize} </td>
                            <td class=""align-middle text-left text-break"">
                                ${items[i].name}
                            </td>
                            <td class=""align-middle text-left text-break"">
                                ${items[i].shortDesc}
                            </td>
                            <td class=""ali");
            WriteLiteral(@"gn-middle text-left text-break"">
                                ${items[i].academicYear.name}
                            </td>
                            <td class=""align-middle text-left text-break"">
                                ${items[i].specialization.name}
                            </td>
                            <td class=""text-center align-middle"">
                                <button type=""button"" class=""btn btn-primary mr-2"" data-toggle=""modal"" data-target=""#modalEdit"" onclick=""getDetail('${items[i].id}', 1)"">
                                    <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" fill=""currentColor"" class=""bi bi-pencil-square"" viewBox=""0 0 16 16"">
                                      <path d=""M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z""></path>
                                     ");
            WriteLiteral(@" <path fill-rule=""evenodd"" d=""M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z""></path>
                                    </svg>
                                </button>
                                <button type=""button"" class=""btn btn-danger"" data-toggle=""modal"" data-target=""#modalDelete"" onclick=""getDetail('${items[i].id}', 2)"">
                                    <svg xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" fill=""currentColor"" class=""bi bi-trash3"" viewBox=""0 0 16 16"">
                                      <path d=""M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.");
            WriteLiteral(@"916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z""></path>
                                    </svg>
                                </button>
                            </td></tr>`;
                }
                $('#data').html(s);

                $('#resultmessage').html(`???? hi???n th??? ${items.length} trong s??? ${data.totalRecords} k???t qu???`);
                showPageScroll(data.pageIndex, data.pageCount);
            },
            error: function () {
                $('#message').html(""T???i danh s??ch t???t c??? l???p sinh ho???t th???t b???i"");
            }
        });
    }

    function create() {
        //Prepare data
        var rows = $(""#createList"").find('tr');
        var obj = null;
        var arrObj = [];
        for (var i = 0; i < rows.length; i++) {
            var cols = $(rows[i]).find('td');

   ");
            WriteLiteral(@"         var data1 = $(cols[0]).find('input').val();
            var data2 = $(cols[1]).find('input').val();
            var data3 = $(cols[2]).find('select').val();

            obj = { ""name"": data1, ""description"": data2, ""specializationId"": data3 };

            arrObj.push(obj);
        }

        var acaYearId = $('#modalCreate_SelectList').val();
        if (acaYearId == null) {
            return false;
        }

        var postData = { ""academicYearId"": acaYearId, ""data"": arrObj };

        console.log(JSON.stringify(postData));
        //Post data
        $.ajax({
            type: ""POST"",
            url: ""/api/lopsinhhoatapi/createac"",
            dataType: 'json',
            data: JSON.stringify(postData),
            contentType: 'application/json',
            success: function (result) {
                showMessage(result.message);
                refreshModalCreate();
                goToPage(1);
            },
            error: function (result) {
           ");
            WriteLiteral(@"     showMessage(result.message);
            },
        });
    }

    function refreshModalCreate() {
        var refresh = ``;
        $('#createList').html(refresh);
        $('#modalCreate_SelectList').val(-1).change();
    }

    function showMessage(str) {
        $('#message').html(str);
    }

    function getDetail(id, handle) {
        $.ajax({
            type: ""GET"",
            url: ""/api/lopsinhhoatapi/getbyid?id="" + id,
            success: function (result) {
                if (handle == 1) {
                    $('#modalEdit_Id').val(result.id);
                    $('#modalEdit_Name').val(result.name);
                    $('#modalEdit_ShortDesc').val(result.shortDesc);
                    $('#modalEdit_AcademicYear').val(result.academicYearId).change();
                    $('#modalEdit_Specialization').val(result.specializationId).change();
                } else {
                    $('#modalDelete_Id').val(result.id);
                    $('#modalDelete_Nam");
            WriteLiteral(@"e').val(result.name);
                    $('#modalDelete_ShortDesc').val(result.shortDesc);
                    $('#modalDelete_AcademicYear').val(result.academicYear.name);
                    $('#modalDelete_Specialization').val(result.specialization.name);
                }
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });
    }

    function update() {
        //prepare data
        var param1 = $('#modalEdit_Id').val();
        var param2 = $('#modalEdit_Name').val();
        var param3 = $('#modalEdit_ShortDesc').val();
        var param4 = $('#modalEdit_AcademicYearId').val();
        var param5 = $('#modalEdit_SpecializationId').val();
        
        var obj = { ""id"": param1, ""name"": param2, ""academic"": param3, ""educationTypeId"": param4, ""description"": param5, ""startYear"": param6, ""endYear"": param7 };

        //put data
        $.ajax({
            type: ""PUT"",
            url: ""/api/nienkhoaapi/updatea");
            WriteLiteral(@"y"",
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            success: function (result) {
                goToPage(1);
                showMessage(result.message);
            },
            error: function (result) {
                showMessage(result.message);
            },
        });
    }
    function remove() {
        //prepare data
        var param1 = $('#modalDelete_Id').val();

        //put data
        $.ajax({
            type: ""DELETE"",
            url: ""/api/lopsinhhoatapi/deleteay?id="" + param1,
            dataType: 'json',
            //data: JSON.stringify(obj),
            contentType: 'application/json',
            success: function (result) {
                showMessage(result.message);
                goToPage(1);
            },
            error: function (result) {
                showMessage(result.message);
            },
        });
    }

    function loadAcademicYearSelectLis");
            WriteLiteral(@"t() {
        $.ajax({
            type: ""GET"",
            url: getUrl(""/api/nienkhoaapi/getall"", 1, 1000, """"),
            success: function (result) {
                var items = result.data.items;
                var a = `<option value=""-1"" selected>--Ch???n Ni??n kh??a--</option>`;
                var b = `<option value=""-1"" disabled selected>--Ch???n Ni??n kh??a--</option>`;
                var s = ``;
                for (var i = 0; i < items.length; ++i) {
                    s += `<option value=""${items[i].id}"">${items[i].name}</option>`;
                }

                a += s;
                b += s;

                $('#searchwithay').html(a);
                $('#modalEdit_AcademicYear').html(b);
                $('#modalCreate_SelectList').html(b);
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });
    }

    function loadSpecializationSelectList() {
        $.ajax({
            type: ""GET"",
            u");
            WriteLiteral(@"rl: getUrl(""/api/chuyennganhapi/getall"", 1, 1000, """"),
            success: function (result) {
                var items = result.data.items;
                var a = `<option value=""-1"" selected>--Ch???n Chuy??n ng??nh--</option>`;
                var b = `<option value=""-1"" disabled selected>--Ch???n Chuy??n ng??nh--</option>`;
                var s = ``;
                for (var i = 0; i < items.length; ++i) {
                    s += `<option value=""${items[i].id}"">${items[i].name}</option>`;
                }

                a += s;
                b += s;

                $('#searchwithspc').html(a);
                $('#modalEdit_Specialization').html(b);
                $('#modalCreate_SpecializationSelectList').html(b);
            },
            error: function () {
                $('#message').html(""Api l???i"");
            }
        });

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
