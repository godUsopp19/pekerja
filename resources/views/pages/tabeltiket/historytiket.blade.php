@extends('layouts.default', ['sidebarSearch' => true])

@section('title', 'History Tiket')

@section('content')


		<!-- begin panel -->
		<div class="panel panel-info">
			<!-- begin panel-heading -->
			<div class="panel-heading">
				<h4 class="panel-title">History Tiket </h4>
				<div class="panel-heading-btn">
					<a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning"
						data-click="panel-collapse"><i class="fa fa-minus"></i></a>
				</div>
			</div>
			<!-- end panel-heading -->
			<!-- begin panel-body -->
			<div class="panel-body">
                <div id="grid-historytiket" style="height: 640px; width:100%;"></div>
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
            return sendRequest(apiurl + "/hist-tiket");
        },
        insert: function(values) {
            return sendRequest(apiurl + "/hist-tiket", "POST", values);
        },
        update: function(key, values) {
            return sendRequest(apiurl + "/hist-tiket/"+key, "PUT", values);
        },
        remove: function(key) {
            return sendRequest(apiurl + "/hist-tiket/"+key, "DELETE");
        }
    });

    function moveEditColumnToLeft(dataGrid) {
		dataGrid.columnOption("command:edit", { 
			visibleIndex: -1,
			width: 80 
		});
    }
    // pilihan select box
    const tipetiket = [{ID: 1,tipe: 'Kedatangan'}, {ID: 2,tipe: 'Kepulangan'}];
    const tipeclaim = [{ID: 1,claim: 'Claim'}, {ID: 2,claim: 'Perusahaan'}];
    const statusad = [{ID: 1,stat: 'Ada'}, {ID: 2,stat: 'Tidak Ada'}];
    const tipetransp = [{ID: 1,transp: 'Pesawat'}, {ID: 2,transp: 'Laut'}];
    
    // attribute
   var dataGrid = $("#grid-historytiket").dxDataGrid({    
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
            allowDeleting: true
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
                dataField: 'no_nik',
                    width: 200,
                    editorType: "dxDropDownBox",
                    caption: 'NIK',
                    lookup: {
                        dataSource: listPekerja,
                        displayExpr: "no_nik",
                        valueExpr: "no_nik"
                    },
                    editorOptions: {
                        dataSource: listPekerja,
                        valueExpr: 'no_nik',
                        displayExpr: 'no_nik',
                        contentTemplate: function(e){
                            var $dataGrid = $("<div>").dxDataGrid({
                                dataSource: e.component.option("dataSource"),
                                keyExpr: "no_nik",
                                columns: [{dataField:"no_nik",width:150},{dataField:"nama_pekerja",width:150},
                                {dataField:"nama_kontraktor",width:100}],
                                height: 265,
                                selectedRowKeys: e.component.option("value"),
                                focusedRowEnabled: true,
                                focusedRowKey: e.component.option("value"),
                                selection: { mode: "single" },
                                searchPanel: {
                                    visible: true,
                                    width: 155,
                                    placeholder: "Search..."
                                },
                                onSelectionChanged: function(selectedItems){
                                    var keys = selectedItems.selectedRowKeys,
                                    hasSelection = keys.length;
                                    
                                    if(hasSelection){
                                    e.component.option("value", keys);                                    
                                    }   
                                }
                                })
                                return $dataGrid;
                                },     
                        // onValueChanged: function(e){
                            
                        //     e.component.close();
                        
                        // },
                        
                        },
                        setCellValue(rowData, value){
                            var allPekerja = listPekerja.store.__rawData
                            var pekerja = allPekerja.filter(function(pekerja){
                                
                                return pekerja.no_nik == value
                            })
                            rowData.no_nik = pekerja[0].no_nik
                            rowData.nama_pekerja = pekerja[0].nama_pekerja
                            rowData.nama_kontraktor = pekerja[0].nama_kontraktor
                            }

            },
            {
                dataField: "nama_pekerja",
                caption: "Nama Pekerja",
                editorOptions: {readOnly: true,},
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "nama_kontraktor",
                editorOptions: {readOnly: true,},
                caption: "Nama Kontraktor",
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "no_invoice",
                caption: "Nomor Invoice",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "type_tiket",
                caption: "Tipe Tiket",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: tipetiket,  
                    valueExpr: 'tipe',
                    displayExpr: 'tipe',
                },
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "tgl_tiket",
                caption: "Tanggal Tiket",
                editorType: "dxDateBox",
                dataType:"date", format:"dd-MM-yyyy",displayFormat: "dd-MM-yyyy",
                editorOptions: {
                    displayFormat: "yyyy-MM-dd"
                },
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "kota_asal",
                caption: "Kota Asal",
                validationRules: [
					{
						type:'required'
					}
                ]
            },
			{ 
                dataField: "rute_dari",
                caption: "Rute dari",
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "rute_tujuan",
                caption: "Rute Tujuan",
                validationRules: [
                    { type: "required"}
                ]
            },
            {
                dataField: "biaya",
                caption: "Biaya",
                validationRules: [
                    { type: "required"},
                    { type: "numeric"}
                ]
            },
            { 
                dataField: "estate",
                caption: "Estate",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: listEstate,  
                    valueExpr: 'kode_estate',
                    displayExpr: 'kode_estate',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
			{ 
                dataField: "type_claim",
                caption: "Tipe Claim",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: tipeclaim,  
                    valueExpr: 'claim',
                    displayExpr: 'claim',
                },
                validationRules: [
                    { type: "required" }
                ]
            },
            {
                dataField: "transport",
                caption: "Jenis Transport",
                editorType:"dxSelectBox",
                lookup: {
                    dataSource: tipetransp,  
                    valueExpr: 'transp',
                    displayExpr: 'transp',
                },
                validationRules: [
                    { type: "required"}
                ]
            },
			{ 
                dataField: "ket_tiket",
                caption: "Keterangan"
            }
        ],
        export: {
            enabled: true,
            fileName: "hist-tiket",
            excelFilterEnabled: true,
            allowExportSelectedData: true
        },
        onContentReady: function(e){
            moveEditColumnToLeft(e.component);
        },
        onEditorPreparing: function(e) {
       
        },
        onInitialized: function(e) {
            dataGrid = e.component;
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
