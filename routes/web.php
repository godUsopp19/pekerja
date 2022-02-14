<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', 'HomeController@index');
// Route::auth();
// Auth::routes();

// Route::group( ['prefix' => 'admin','as' => 'admin.','middleware' => ['auth']], function() {
Route::group( ['as' => 'pekerja.','middleware' => ['auth']], function() {

    Route::get('/', 'HomeController@index')->name('index');

    //referensi
    Route::get('/ref-agama','referensi\AgamaController@show')->name('refagama');
    Route::apiResource('/api/ref-agama','referensi\AgamaController');

    Route::get('/ref-gender','referensi\GenderController@show')->name('refgender');
    Route::apiResource('/api/ref-gender','referensi\GenderController');

    Route::get('/ref-kontraktor','referensi\KontraktorController@show')->name('refkontraktor');
    Route::apiResource('/api/ref-kontraktor','referensi\KontraktorController');

    Route::get('/ref-vaksin','referensi\VaksinController@show')->name('refvaksin');
    Route::apiResource('/api/ref-vaksin','referensi\VaksinController');
    
    Route::get('/ref-departemen','referensi\DepartemenController@show')->name('refdepartemen');
    Route::apiResource('/api/ref-departemen','referensi\DepartemenController');

    Route::get('/ref-estate','referensi\EstateController@show')->name('refestate');
    Route::apiResource('/api/ref-estate','referensi\EstateController');
    //master user
    Route::get('/master-user','masteruser\LoginUserController@show')->name('masteruser');

    //master table
    Route::get('/master-lcmaster','legalcompliance\lcmasterController@show')->name('lcmaster');
    Route::apiResource('/api/master-lcmaster','legalcompliance\lcmasterController');

    Route::get('/hist-tiket','tabeltiket\historytiketController@show')->name('historytiket');
    Route::apiResource('/api/hist-tiket','tabeltiket\historytiketController');
    //API
    Route::apiResource('/api/master-user','masteruser\LoginUserController');
    
    // Route::apiResource('/api/equipment','kap\EquipmentController');
    // Route::apiResource('/api/monitoring','kap\MonitoringController');
    
});

require __DIR__.'/auth.php';
