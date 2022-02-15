<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\UserAppointment;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
  

    public function index()
    {
        return view('appointment.admin');
    }



    public function getAppointmentData(Request $request)
    {
        $appData = UserAppointment::where('user', $request['user'])->where('year', $request['year'])->where('month', $request['month'])->where('day', $request['day'])->get();
        $appData = $appData->sortBy('start_at')->values();

        return response()->json([
            'app' => $appData, 
            'appCount' => $appData->count()
        ]);
    }


    public function getAppointmentDays(Request $request)
    {
        $appDays = UserAppointment::where('user', $request['user'])->where('year', $request['year'])->where('month', $request['month'])->select('day')->get();

        return response()->json(['appDays' => $appDays, 'appDaysCount' => $appDays->count()]);
    }


    public function removeApp(Request $request)
    {
        UserAppointment::where('user', $request['user'])->where('id', $request['id'])->delete();

        return response()->json(['status' => 'ok']);
    }
    

    public function getUsersData()
    {
        $usersData = User::get();

        return response()->json(['response'=>'ok','user' => $usersData, 'usersCount' => $usersData->count()]);
    }

}

