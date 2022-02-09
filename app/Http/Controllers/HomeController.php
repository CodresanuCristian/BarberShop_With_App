<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

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
        $total_cells = 6 * 7;
        $current_day = Carbon::today()->day;
        $current_month = Carbon::today()->format('F');
        $current_year = Carbon::today()->year;
        $days_in_month = Carbon::now()->daysInMonth;
        $day_of_week = Carbon::now()->dayOfWeek;
        $start_day = Carbon::createFromDate($current_year, Carbon::today()->month, 1)->dayOfWeek;

        return view('appointment.admin')->with([
            'total_cells' => $total_cells,
            'current_day' => $current_day,
            'current_month' => $current_month,
            'current_year' => $current_year,
            'days_in_month' => $days_in_month,
            'day_of_week' => $day_of_week,
            'start_day' => $start_day,
            'month' => Carbon::today()->month,
        ]);
    }
}
