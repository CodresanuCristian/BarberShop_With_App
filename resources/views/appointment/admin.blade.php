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
        <h4 id='no-app' class='text-center'><strong>There are no appointments</strong></h4>
        <div id='list-items'></div>
    </div>

    {{-- Remove --}}
    <div class='remove-window'>
        <div class='d-flex flex-column justify-content-center align-items-center' style='height:26vh;'>
            <h4 class='mb-4 text-center'>Are you sure you want to remove this appointment ?</h4>
            <div class='container d-flex justify-content-center'>
                <button class='mybtn mx-5 mt-4' id='remove-yes'>Yes</button>
                <button class='mybtn mx-5 mt-4' id='remove-cancel'>Cancel</button>
            </div>
        </div>
    </div>

    {{-- Edit window --}}
    <div class='edit-window'>
        <div class='d-flex flex-column flex-wrap'>
        <div class='edit-header'>
            <h4>Edit</h4>
            <img id='edit-close' src='/icon/close.png'>
        </div>

        <form class='d-flex flex-column' style='width:50vw;'>
            {{-- edit client and barber --}}
            <div class='row overflow-hidden'>
                <div class='col-xl-4 my-3 d-flex'>
                    <img src='icon/scissors.png'>
                    <select id='select-user' name='user'></select>
                </div>
                <div class='col-xl-4 my-3 d-flex'>
                    <img src='icon/barbers.png'>
                    <input type='text' id='client-name' name='client-name' value=''>
                </div>
                <div class='col-xl-4 my-3 d-flex overflow-hidden'>
                    <img src='icon/phone.png'>
                    <input type='tel' id='client-phone' name='client-phone' value=''>
                </div>
            </div>
            {{-- edit services pack --}}
            <div class='row overflow-hidden mt-4'>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack1'>                    
                    <input class='mx-2' type='checkbox' name='pack1' id='check1'>                    
                    <p>Pack 1</p>
                </div>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack2'>                    
                    <input class='mx-2' type='checkbox' name='pack2' id='check2'>                    
                    <p>Pack 2</p>
                </div>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack3'>                    
                    <input class='mx-2' type='checkbox' name='pack3' id='check3'>                    
                    <p>Pack 3</p>
                </div>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack4'>                    
                    <input class='mx-2' type='checkbox' name='pack4' id='check4'>                    
                    <p>Pack 4</p>
                </div>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack5'>                    
                    <input class='mx-2' type='checkbox' name='pack5' id='check5'>                    
                    <p>Pack 5</p>
                </div>
                <div class='col-xl-2 col-lg-4 col-md-6 col-sm-6 d-flex flex-row justify-content-center align-items-center p-0 my-2 selectpack' id='pack6'>                    
                    <input class='mx-2' type='checkbox' name='pack6' id='check6'>                    
                    <p>Pack 6</p>
                </div>
            </div>
            {{-- edit date and hour --}}
            <div class='row overflow-hidden my-4'>
                <div class='col-xl-6 my-3 d-flex'>
                    <img src='icon/calendar.png'>
                    <select id='select-year' name='year' class='date'></select>
                    <h3 class='mx-1'>/</h3>
                    <select id='select-month' name='month' class='date'></select>
                    <h3 class='mx-1'>/</h3>
                    <select id='select-day' name='day' class='date'></select>
                </div>
                <div class='col-xl-6 my-3 d-flex '>
                    <img src='icon/clock.png'>
                    <select id='select-start-hour' name='start-hour' class='clock'></select>
                    <h4 class='mx-1'>:</h4>
                    <select id='select-start-min' name='start-min' class='clock'> </select>
                    <h3 class='mx-3'>-</h3>
                    <select id='select-end-hour' name='end-hour' class='clock'></select>
                    <h4 class='mx-1'>:</h4>
                    <select id='select-end-min' name='end-min' class='clock'></select>
                </div>
            </div>
            
            <div class='mt-3 d-flex justify-content-between align-items-center'>
                <div>
                    <button type='button' class='mybtn edit-apply'>Apply</button>
                    <button type='button' class='mybtn edit-cancel mx-3'>Cancel</button>
                </div>
                <div>
                    <h5 class='m-0' id='edit-total'></h5>
                </div>
            </div>
        </form>
    </div>
    </div>
</div>

<script src='js/calendar.js'></script>

@endsection