<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Carbon;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(){
                
        if(Auth::user()->role == 'admin') {
            
            return view('dashboard-admin');

        } elseif(Auth::user()->role == 'user') {

            return view('dashboard-admin');

        }

    }
}
