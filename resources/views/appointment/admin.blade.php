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

    <div class='list'>
        <div style='position:relative;'>
            <h1 id='list-date'></h1>
            <img id='list-close' src='/icon/close.png'>
        </div>
        @for ($i=1; $i<3; $i++)
            <div class='list-row'>
                <div class='d-flex align-items-center mx-5 my-3'>
                    <img class='mr-2' src='/icon/clock.png'>
                    <h5 id='app-hour'>10:00 - 11:00</h5>
                </div>
                <div class='d-flex align-items-center mx-5 my-3'>
                    <img class='mr-2' src='/icon/barbers.png'>
                    <h4 id='app--name'>Client 1 - </h4>
                    <h4 id='app-pack'> Pack 1, Pack 2</h4>
                </div>
                <div class='d-flex align-items-center mx-5 my-3'>
                    <img class='mr-2' src='/icon/phone.png'>
                    <h5 id='app-phone'>0762283480</h5>
                </div>
                <div class='d-flex align-items-center mx-5 my-3'>
                    <img class='mr-2' src='/icon/cash.png'>
                    <h5 id='app-price'>90 LEI</h5>
                </div>
                <div class='d-flex mx-5 mt-4 mb-3'>
                <button class='mybtn' type="button">Edit</button>
                <button class='mybtn mx-3' type="button">Remove</button>
                </div>
            </div>
        @endfor
    </div>
</div>







<script>
    $(document).ready(function(){
        // CURRENT MONTH
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var currentDate = new Date();
        var currentDay = currentDate.getUTCDate();                               
        var currentMonth = currentDate.getUTCMonth();                            // 0-11
        var currentYear = currentDate.getUTCFullYear();                          
        var firstDayOfMonth = new Date(currentYear, currentMonth).getUTCDay();   // 0..6 (Sunday..Saturday)
        var daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();    // 1-31
        var tempDate = '';

        $('#header-date').html(month[currentMonth]+' '+currentYear);
        DrawCalendar(firstDayOfMonth, daysInMonth, currentMonth, currentDay);
    


        // NEXT MONTH
        $('#next-month').click(function(){
            currentMonth++;
            if (currentMonth > 11){
                currentMonth = 0;
                currentYear++;
            }

            tempDate = new Date(currentYear, currentMonth, 1);
            daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
            firstDayOfMonth = tempDate.getUTCDay();

            $('#header-date').html(month[currentMonth]+' '+currentYear);
            DrawCalendar(firstDayOfMonth, daysInMonth, currentMonth, currentDay);
        });


        // PREV MONTH
        $('#prev-month').click(function(){
            currentMonth--;
            if (currentMonth < 0){
                currentMonth = 11;
                currentYear--;
            }

            tempDate = new Date(currentYear, currentMonth, 1);
            daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
            firstDayOfMonth = tempDate.getUTCDay();

            $('#header-date').html(month[currentMonth]+' '+currentYear);
            DrawCalendar(firstDayOfMonth, daysInMonth, currentMonth, currentDay);
        });


        // SELECT DAY
        $('td').click(function(){
            if ($(this).attr('id')){
                $('.list').fadeIn();
                $('#list-date').html('<strong>' + $(this).attr('id') + ' ' + month[currentMonth] + ' ' + currentYear + '</strong>');
            }
        });


        // CLOSE APPOINTMENT LIST
        $('#list-close').click(function(){
            $('.list').fadeOut();
        })
    });




    function DrawCalendar(firstDayOfMonth, daysInMonth, currentMonth, currentDay)
    {
        var td = document.querySelectorAll('td');
        var day = 1;

        for (let i=0; i<42; i++)
        {            
            if ((i < firstDayOfMonth) || (day > daysInMonth))
            {
                $(td[i]).html('');
                $(td[i].setAttribute('id', ''));
                $(td[i].setAttribute('class', ''));
            }
            
            if ((i >= firstDayOfMonth) && (day <= daysInMonth))
            {
                if ((day == currentDay) && (new Date().getMonth() == currentMonth))
                    $(td[i].setAttribute('class', 'active today'));
                else                   
                    $(td[i].setAttribute('class', 'active'));

                $(td[i]).html('<strong>'+day+'</strong>');
                $(td[i].setAttribute('id', day));
                day++;
            }
        }
    }
</script>
@endsection