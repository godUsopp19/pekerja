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
            'icon' => 'fa fa-th-large',
            'title' => 'Dashboard',
            'url' => '/',
            'route-name' => 'admin.index'
        ],[
            'icon' => 'fa fa-layer-group',
            'title' => 'KAP',
            'url' => 'javascript:;',
            'caret' => true,
            'sub_menu' => [
                [
                    'url' => '/monitoring',
                    'title' => 'Monitoring',
                    'route-name' => 'kap.monitoring'
                ],
                [
                    'url' => '/equipment',
                    'title' => 'Equipment',
                    'route-name' => 'kap.equipment'
                ],
            ]
        ]
    ]
];
