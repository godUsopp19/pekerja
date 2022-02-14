@extends('layouts.default', ['sidebarSearch' => true])

@section('title', 'Tabel Master')

@section('content')


		<!-- begin panel -->
		<div class="panel panel-info">
			<!-- begin panel-heading -->
			<div class="panel-heading">
				<h4 class="panel-title">Tabel Master </h4>
				<div class="panel-heading-btn">
					<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning"
						data-click="panel-collapse"><i class="fa fa-minus"></i></a>
				</div>
			</div>
			<!-- end panel-heading -->
			<!-- begin panel-body -->
			<div class="panel-body">
                <div id="grid-lcmaster" style="height: 640px; width:100%;"></div>
			</div>
			<!-- end panel-body -->
		</div>
		<!-- end panel -->

@endsection

@push('scripts')
<script>

var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function() {
            return sendRequest(apiurl + "/master-lcmaster");
        },
        insert: function(values) {
            return sendRequest(apiurl + "/master-lcmaster", "POST", values);
        },
        update: function(key, values) {
            return sendRequest(apiurl + "/master-lcmaster/"+key, "PUT", values);
        },
        remove: function(key) {
            return sendRequest(apiurl + "/master-lcmaster/"+key, "DELETE");
        }
    });

    function moveEditColumnToLeft(dataGrid) {
		dataGrid.columnOption("command:edit", { 
			visibleIndex: -1,
			width: 80 
		});
    }
    const statusad = [{ID: 1,stat: 'Ada'}, {ID: 2,stat: 'Tidak Ada'}];
    const statusadktp = [{ID: 1,stat: 'KTP Ada'}, {ID: 2,stat: 'KTP Tidak Ada'}];
    const statusadkk = [{ID: 1,stat: 'KK Ada'}, {ID: 2,stat: 'KK Tidak Ada'}];
    const statusadbk = [{ID: 1,stat: 'BPJS Ketenagakerjaan Ada'}, {ID: 2,stat: 'BPJS Ketenagakerjaan Tidak Ada'}];
    const statusadbkes = [{ID: 1,stat: 'BPJS Kesehatan Ada'}, {ID: 2,stat: 'BPJS Kesehatan Tidak Ada'}];
    const statusadbp = [{ID: 1,stat: 'BPJS Pensiun Ada'}, {ID: 2,stat: 'BPJS Pensiun Tidak Ada'}];
    const statusadidb = [{ID: 1,stat: 'ID Badge Ada'}, {ID: 2,stat: 'ID Badge Tidak Ada'}];
    const statusadkp = [{ID: 1,stat: 'Kontrak Pekerja Ada'}, {ID: 2,stat: 'Kontrak Pekerja Tidak Ada'}];
    const statusadsp = [{ID: 1,stat: 'Slip Gaji Ada'}, {ID: 2,stat: 'Slip Gaji Tidak Ada'}];
    const statusadwl = [{ID: 1,stat: 'Wajib Lapor Ada'}, {ID: 2,stat: 'Wajib Lapor Tidak Ada'}];
    // attribute
   var dataGrid = $("#grid-lcmaster").dxDataGrid({    
        dataSource: store,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnsAutoWidth: true,
        columnMinWidth: 150,
        wordWrapEnabled: true,
        showBorders: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        selection: {
            mode: "multiple"
        },
        editing: {
            useIcons:true,
            mode: "popup",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            form:{
            items: [{
                itemType:'group',
                colCount: 2,
                colSpan: 2,
                caption: 'Kegiatan di Perusahaan',
                items:['kegiatan','nama_kontraktor','sektor','department','tanggal']
            },{
                itemType:'group',
                colCount: 2,
                colSpan: 2,
                caption:'Biodata Pekerja',
                items:['nama_pekerja','jenis_kelamin','agama','tempat_lahir','tgl_lahir']
            },{
                itemType:'group',
                colCount: 2,
                colSpan: 2,
                caption:'Dokumen Identitas',
                items:['ktp','other_ktp_desc', 'no_nik', 'kk','no_kk','kota_penerbit','id_badge',
                'no_badge','bpjs_ketenagakerjaan','no_bpjsketenagakerjaan','bpjs_kesehatan',
                'no_bpjskesehatan','bpjs_pensiun','no_jaminanpensiun','wajib_lapor','no_wajiblapor',
                'kontrak_pekerja','no_perjanjian','slip_gaji','jenis_bpjs','alamat_ktp']
            }]
            },
        },
        scrolling: {
            mode: "virtual"
        },

        columns: [
            {
                caption: '#',
                formItem: { 
                    visible: false
                },
                width: 40,
                cellTemplate: function(container, options) {
                    container.text(options.rowIndex +1);
                }
            },
            { 
                dataField: "kegiatan",
                caption: "Kegiatan",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "nama_kontraktor",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: listKontraktor,  
                    valueExpr: 'nama_kontraktor',
                    displayExpr: 'nama_kontraktor',
                },
                caption: "Nama Kontraktor",
                validationRules: [
                    { type: "required"}
                ]
            },
			{ 
                dataField: "nama_pekerja",
                caption: "Nama Pekerja",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "jenis_kelamin",
                caption: "Jenis Kelamin",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: listGender,  
                    valueExpr: 'keterangan_gender',
                    displayExpr: 'keterangan_lp',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "agama",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: listAgama,  
                    valueExpr: 'keterangan_agama',
                    displayExpr: 'keterangan_agama',
                },
                caption: "Agama",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "sektor",
                caption: "Sektor",
                validationRules: [
                    { type: "required"}
                ]
            },
			{ 
                dataField: "department",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: listDepartemen,  
                    valueExpr: 'nama_departemen',
                    displayExpr: 'nama_departemen',
                },
                caption: "Department",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "kk",
                caption: "KK",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadkk,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "no_kk",
                caption: "Nomor KK",
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "ktp",
                caption: "KTP",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadktp,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "other_ktp_desc",
                caption: "Selain KTP"
            },
            {
                dataField: "no_nik",
                caption: "NIK",
                validationRules: [
					{type:'required'}
                ]
            },
			{ 
                dataField: "kota_penerbit",
                caption: "Kota Penerbit",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "tempat_lahir",
                caption: "Tempat Lahir",
                validationRules: [
                    { type: "required"}
                ]
            },
			{ 
                dataField: "tgl_lahir",
                caption: "Tanggal Lahir",
                editorType: "dxDateBox",
                dataType:"date", format:"dd-MM-yyyy",displayFormat: "dd-MM-yyyy",
                editorOptions: {
                    displayFormat: "yyyy-MM-dd",
                }
            },
            {
                dataField: "id_badge",
                caption: "ID Badge",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadidb,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "no_badge",
                caption: "Nomor Badge",
                validationRules: [
                    { type: "required"}
                ]
            },
			{ 
                dataField: "bpjs_ketenagakerjaan",
                caption: "BPJS Ketenagakerjaan",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadbk,  
                    valueExpr: 'stat', 
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "no_bpjsketenagakerjaan",
                caption: "Nomor BPJS Ketenagakerjaan",
                validationRules: [
                    { type: "required"}
                ]
            },
            { 
                dataField: "bpjs_kesehatan",
                caption: "BPJS Kesehatan",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadbkes,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "no_bpjskesehatan",
                caption: "Nomor BPJS Kesehatan",
                validationRules: [
                    { type: "required" }
                ]
            },
            { 
                dataField: "bpjs_pensiun",
                caption: "BPJS Ketenagakerjaan",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadbp,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "no_jaminanpensiun",
                caption: "Nomor Jaminan Pensiun",
                validationRules: [
                    { type: "required"}
                ]
            },
            { 
                dataField: "wajib_lapor",
                caption: "Wajib Lapor",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadwl,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "no_wajiblapor",
                caption: "Nomor Wajib Lapor",
                validationRules: [
                    { type: "required" }
                ]
            },
            { 
                dataField: "kontrak_pekerja",
                caption: "Kontrak Pekerja",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadkp,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "no_perjanjian",
                caption: "Nomor Perjanjian",
                validationRules: [
                    { type: "required"}
                ]
            },
            { 
                dataField: "slip_gaji",
                caption: "Slip Gaji",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: statusadsp,  
                    valueExpr: 'stat',
                    displayExpr: 'stat',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "jenis_bpjs",
                caption: "Jenis BPJS",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "tanggal",
                caption: "Tanggal",
                editorType: "dxDateBox",
                dataType:"date", format:"dd-MM-yyyy",displayFormat: "dd-MM-yyyy",
                editorOptions: {
                    displayFormat: "yyyy-MM-dd",
                }
            },          
			{ 
                dataField: "alamat_ktp",
                caption: "Alamat KTP",
                validationRules: [
                    { type: "required" }
                ]
            },
            // {
            //     dataField: "keterangan_vaksin",
            //     caption: "Keterangan Vaksin",
            //     validationRules: [
            //         { type: "required"}
            //     ]
            // },
			// { 
            //     dataField: "lokasi_vaksin",
            //     caption: "Lokasi Vaksin",
            //     validationRules: [
            //         { type: "required" }
            //     ]
            // },
            // {
            //     dataField: "tgl_vaksin",
            //     caption: "Tanggal Vaksin Ke-1",
            //     editorType: "dxDateBox",
            //     dataType:"date", format:"dd-MM-yyyy",displayFormat: "dd-MM-yyyy",
            //     editorOptions: {
            //         displayFormat: "yyyy-MM-dd",
            //     }
            // },
			// { 
            //     dataField: "lokasi_vaksin2",
            //     caption: "Lokasi Vaksin 2",
            //     validationRules: [
            //         { type: "required" }
            //     ]
            // },
            // {
            //     dataField: "tgl_vaksin2",
            //     caption: "Tanggal Vaksin Ke-2",
            //     editorType: "dxDateBox",
            //     dataType:"date", format:"dd-MM-yyyy",displayFormat: "dd-MM-yyyy",
            //     editorOptions: {
            //         displayFormat: "yyyy-MM-dd",
            //     }
            // },
			// { 
            //     dataField: "nama_dosisvaksin",
            //     editorType:"dxSelectBox",
            //     lookup: {
            //         dataSource: listVaksin,  
            //         valueExpr: 'nama_vaksin',
            //         displayExpr: 'nama_vaksin',
            //     },
            //     caption: "Nama Dosis Vaksin",
            //     validationRules: [
            //         { type: "required" }
            //     ]
            // }
        ],
        export: {
            enabled: true,
            fileName: "master-lcmaster",
            excelFilterEnabled: true,
            allowExportSelectedData: true
        },
        onContentReady: function(e){
            moveEditColumnToLeft(e.component);
        },
        onEditorPreparing: function(e) {
       
        },
        onToolbarPreparing: function(e) {
            dataGrid = e.component;
    
            e.toolbarOptions.items.unshift({						
                location: "after",
                widget: "dxButton",
                options: {
                    hint: "Refresh Data",
                    icon: "refresh",
                    onClick: function() {
                        dataGrid.refresh();
                    }
                }
            })
        },
    }).dxDataGrid("instance");

</script>

@endpush
