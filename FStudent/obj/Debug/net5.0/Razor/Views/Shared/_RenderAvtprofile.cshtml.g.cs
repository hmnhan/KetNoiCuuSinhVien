#pragma checksum "D:\Github\FStudent\FStudent\Views\Shared\_RenderAvtprofile.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "b23f7167cf16c7fa2b6934d90d74a0f5bc0ba04b"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Shared__RenderAvtprofile), @"mvc.1.0.view", @"/Views/Shared/_RenderAvtprofile.cshtml")]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b23f7167cf16c7fa2b6934d90d74a0f5bc0ba04b", @"/Views/Shared/_RenderAvtprofile.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"ed57bce45706207250efc689fef20c172b31a2fd", @"/Views/_ViewImports.cshtml")]
    public class Views_Shared__RenderAvtprofile : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral(@"<script type=""text/javascript"">
    $(document).ready(function () {
        $.ajax({
            type: 'GET',
            url: '/api/home/renderavtprofile',
            success: function (result) {
                var s = ``;
                var position = result.position1;
                for (var i = 0; i < position.length; i++) {
                    s += `<li class=""bg-gray p-2"">
                                <a href=""/tin-tuc/` + position[i].id + `&&0.html"">`
                                    + position[i].title +
                                `</a>
                            </li>`;    
                }
                $('#boxPs1').html(s);

            }
        });

            

    });
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
