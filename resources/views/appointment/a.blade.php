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
            <a><img src='icon/prev.png'></a>
            <div>
                <h1>Appointment Book</h1>
                <h2 class='text-center mt-3 mb-5'>{{ $current_month}} {{ $current_year}}</h2>
            </div>  
            <a><img src='icon/next.png'></a>
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
        @for ($i = 1; $i <= $total_cells; $i++)
            {{-- open table row --}}
            @if ($i % 7 == 1)
                <tr>
                @if ($i == 1)
                    @php $day = 1; @endphp
                @endif
            @endif
            {{-- create empty cell --}}
            @if (($i < $start_day) || ($day > $days_in_month))
                <td></td>
            @endif
            {{-- write days --}}
            @if (($i >= $start_day) && ($day <= $days_in_month))
                <td id='{{ $day }}' class='active {{ $day == $current_day ? 'today': ''}}'><strong>{{ $day }}</strong></td>
                @php $day++ @endphp
            @endif
            {{-- close table row --}}
            @if (($i % 7 == 0) || ($i == $total_cells))
                </tr>
            @endif
        @endfor
    </table>



</div>
@endsection