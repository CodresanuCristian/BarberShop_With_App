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



    public function GetAppointmentData(Request $request)
    {
        $appData = UserAppointment::where('user', $request['user'])->where('year', $request['year'])->where('month', $request['month'])->where('day', $request['day'])->get();
        $appData = $appData->sortBy('start_at')->values();

        return response()->json([
            'app' => $appData, 
            'appCount' => $appData->count()
        ]);
    }


    public function GetAppointmentDays(Request $request)
    {
        $appDays = UserAppointment::where('user', $request['user'])->where('year', $request['year'])->where('month', $request['month'])->select('day')->get();

        return response()->json(['appDays' => $appDays, 'appDaysCount' => $appDays->count()]);
    }


    public function RemoveApp(Request $request)
    {
        UserAppointment::where('user', $request['user'])->where('id', $request['id'])->delete();

        return response()->json(['status' => 'ok']);
    }



    public function ApplyEdit(Request $request)
    {
        UserAppointment::where('id', $request['id'])
        ->update(['user' => $request['user'], 
                  'client_name' => $request['client_name'],
                  'client_phone' => $request['client_phone'],
                  'year' => $request['year'],
                  'month' => $request['month'],
                  'day' => $request['day'],
                  'start_at' => $request['start_at'],
                  'end_at' => $request['end_at'],
                ]);

        for ($i = 1; $i <= intval($request['countPackage']); $i++)
            UserAppointment::where('id', $request['id'])->update(['package_'.strval($i) => $request['package'][$i]]); 
                
        return response()->json(['status' => 'ok']);
    }

    

    public function GetUsersData()
    {
        $usersData = User::get();

        return response()->json(['users' => $usersData, 'usersCount' => $usersData->count()]);
    }

}

