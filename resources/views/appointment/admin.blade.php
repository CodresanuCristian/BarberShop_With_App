@extends('layouts.app')

@section('content')

<div class='body'>
    {{-- Header --}}
    <header class='header'>
        <span>Welcome {{ Auth::user()->name }}</span>
        <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">{{ __('Logout') }} </a>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden"> {{ csrf_field() }} </form>
    </header>

    {{-- Calendar header --}}
    <div class='calendar-header'>
        <div class='d-flex justify-content-around align-items-center'>
            <a id='prev-month'><img src='icon/prev.png'></a>
            <div>
                <h1>Appointment Book</h1>
                <h2 class='text-center mt-3 mb-5' id='header-date'></h2>
            </div>  
            <a id='next-month'><img src='icon/next.png'></a>
        </div>
    </div>

    {{-- Calendar --}}
    <table>
        <tr>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
        </tr>
        @for ($i = 1; $i <= 42; $i++)
            @if ($i % 7 == 1) <tr> @endif
            <td></td>
            @if ($i % 7 == 0) </tr> @endif
        @endfor
    </table>

    {{-- Appointment list --}}
    <div class='list'>
        <div style='position:relative;'>
            <h1 id='list-date'></h1>
            <img id='list-close' src='/icon/close.png'>
        </div>
        <h1 id='no-app'><strong>There are no appointments</strong></h1>
        <div id='list-items'></div>
    </div>
</div>

<script src='js/calendar.js'></script>

@endsection