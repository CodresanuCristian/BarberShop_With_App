<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\HomeController;

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

Route::get('/', function () {
    return view('index');
});
Auth::routes();

Route::get('/admin', [HomeController::class, 'index'])->name('home');
Route::get('/get-appointment-data', [HomeController::class, 'getAppointmentData']);
Route::get('/get-appointment-days', [HomeController::class, 'getAppointmentDays']);
Route::get('/remove', [HomeController::class, 'removeApp']);
Route::get('/get-users-data', [HomeController::class, 'getUsersData']);

