<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('list-agama','api\ListController@listAgama');
Route::post('list-gender','api\ListController@listGender');
Route::post('list-departemen','api\ListController@listDepartemen');
Route::post('list-kontraktor','api\ListController@listKontraktor');
Route::post('list-vaksin','api\ListController@listVaksin');
Route::post('list-estate','api\ListController@listEstate');
Route::post('list-pekerja','api\ListController@listPekerja');
Route::post('dash-pekerja','legalcompliance\lcmasterController@dashPekerja');