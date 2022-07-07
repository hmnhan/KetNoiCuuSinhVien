$(document).ready(function () {
    if ($('.table').hasClass('result-table')) {
        $('.result-table').DataTable({
            ordering: false,
            pagingType: 'full_numbers',
            "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "Tất cả"]],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/vi.json'
            },
        });
        $('.result-table').removeClass("no-footer");
    } else {
        $('.table').DataTable({
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/vi.json'
            },
        });
        $('.table').removeClass("no-footer");
    }
});
