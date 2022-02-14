// main
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function() {
            return sendRequest(apiurl + "/master-user");
        },
        insert: function(values) {
            return sendRequest(apiurl + "/master-user", "POST", values);
        },
        update: function(key, values) {
            return sendRequest(apiurl + "/master-user/"+key, "PUT", values);
        },
        remove: function(key) {
            return sendRequest(apiurl + "/master-user/"+key, "DELETE");
        }
    });

    function moveEditColumnToLeft(dataGrid) {
		dataGrid.columnOption("command:edit", { 
			visibleIndex: -1,
			width: 80 
		});
    }

    RoleType = [{id:1,roletype:"user"},{id:2,roletype:"admin"}];
    // attribute
    var dataGrid = $("#master-user").dxDataGrid({    
        dataSource: store,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnsAutoWidth: true,
        columnMinWidth: 80,
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
            popup: {
                title: "User Info",
                showTitle: true,
                width: 700,
                height: 525,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
            },
            form: {
                items: [{
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    items: [
                        {
                            dataField: "nama_lengkap",
                        },
                        {
                            dataField: "nomor_hp",
                        },
                        
                    ]
                }, {
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    caption: "Login Info",
                    items: ["role","email", "username","password"]
                }]
            }
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
                dataField: "nama_lengkap",
                caption: "nama lengkap",
                validationRules: [
                    { type: "required" }
                ]
            },
            { 
                dataField: "username",
                validationRules: [
                    { type: "required" }
                ]
            },
            { 
                dataField: "password",
                visible: false,
            },
            { 
                dataField: "email",
                validationRules: [
                    { 
                        type: "email" 
                    },
                    { 
                        type: "required" 
                    }
                ]
            },
            { 
                dataField: "role",
                editorType: "dxSelectBox",
                validationRules: [
                    { 
                        type: "required" 
                    }
                ],
                editorOptions: {
                    dataSource: RoleType,  
                    valueExpr: 'roletype',
                    displayExpr: 'roletype',
                },
            },
            // { 
            //     dataField: "id_rt",
            //     editorType: "dxSelectBox",
            //     // validationRules: [
            //     //     { type: "required" }
            //     // ],
            //     lookup: {
            //         dataSource: listRT,  
            //         valueExpr: 'id',
            //         displayExpr: 'nomor_rt',
            //     },
            // },   
            // { 
            //     dataField: "jabatan",
            //     editorType: "dxSelectBox",
            //     validationRules: [
            //         { type: "required" }
            //     ],
            //     editorOptions: {
            //         dataSource: listJabatan,  
            //         valueExpr: 'nama_jabatan',
            //         displayExpr: 'nama_jabatan',
            //     },
            // },
            { 
                dataField: "nomor_hp",
                caption: "nomor hp",
                validationRules: [
                    { type: "required" }
                ]
            },
            
           
        ],
        export: {
            enabled: true,
            fileName: "master-user",
            excelFilterEnabled: true,
            allowExportSelectedData: true
        },
        onContentReady: function(e){
            moveEditColumnToLeft(e.component);
        },
        onEditorPreparing: function(e) {
            if (e.dataField === "password" && e.parentType === "dataRow") {
                e.editorOptions.value = "";
            }
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