<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

  Route::post('/login',[UserAuthController::class,'login']);
  Route::post('/register',[UserAuthController::class,'register']);

Route::middleware('auth:sanctum')->group(function () {
Route::apiResource('tasks', TaskController::class);
Route::get('trashed', [TaskController::class, 'trashed']);
Route::post('/{id}/restore', [TaskController::class, 'restore']);
Route::delete('tasks/{id}/force', [TaskController::class, 'forceDelete']);
Route::get('/categories', [CategoryController::class, 'index']); 
Route::post('/categories', [CategoryController::class, 'store']); 
});




