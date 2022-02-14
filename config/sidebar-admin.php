<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | Most templating systems load templates from disk. Here you may specify
    | an array of paths that should be checked for your views. Of course
    | the usual Laravel view path has already been registered for you.
    |
    */
  'menu' => [
        [
            'icon' => 'fa fa-home',
            'title' => 'Dashboard',
            'url' => '/',
            'route-name' => 'pekerja.index'
        ],[
            'icon' => 'fa fa-layer-group',
            'title' => 'Tabel Pekerja',
            'url' => 'javascript:;',
             'caret' => true,
            'sub_menu' => [
                [
                    'url' => '/master-lcmaster',
                    'title' => 'Tabel Master',
                    'route-name' => 'pekerja.lcmaster'
                ],
                [
                    'url' => '/hist-tiket',
                    'title' => 'Tabel Tiket',
                    'route-name' => 'pekerja.historytiket'
                ],
            ]
        ],[
            'icon' => 'fa fa-folder',
            'title' => 'Table Refrensi',
            'url' => 'javascript:;',
            'caret' => true,
            'sub_menu' => [
                [
                    'url' => '/ref-agama',
                    'title' => 'Agama',
                    'route-name' => 'pekerja.refagama'
                ],
                [
                    'url' => '/ref-departemen',
                    'title' => 'Departemen',
                    'route-name' => 'pekerja.departemen'
                ],
                [
                    'url' => '/ref-estate',
                    'title' => 'Estate',
                    'route-name' => 'pekerja.refestate'
                ],
                [
                    'url' => '/ref-gender',
                    'title' => 'Gender',
                    'route-name' => 'pekerja.refgender'
                ],
                [
                    'url' => '/ref-kontraktor',
                    'title' => 'Kontraktor',
                    'route-name' => 'pekerja.kontraktor'
                ],
                [
                    'url' => '/ref-vaksin',
                    'title' => 'Vaksin',
                    'route-name' => 'pekerja.vaksin'
                ] 
            ]
        ],[
            'icon' => 'fa fa-users',
            'title' => 'Kelola User',
            'url' => '/master-user',
            'route-name' => 'admin.masteruser'
        ],
        // [
        //     'icon' => 'fa fa-question-circle',
        //     'title' => 'Bantuan',
        //     'url' => '/bantuan',
        // ]
    ]
];
