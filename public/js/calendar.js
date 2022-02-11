$(document).ready(function(){

    // CREATE DAYS FOR THE CURRENT MONTH ======================================================================
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var currentDate = new Date();
    var currentDay = currentDate.getUTCDate();                               
    var currentMonth = currentDate.getUTCMonth();                            // 0-11
    var currentYear = currentDate.getUTCFullYear();                          
    var firstDayOfMonth = new Date(currentYear, currentMonth).getUTCDay();   // 0..6 (Sunday..Saturday)
    var daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();    // 1-31
    var tempDate = '';

    $('#header-date').html(month[currentMonth]+' '+currentYear);
    DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay);



    // NEXT MONTH ==============================================================================================
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
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay);
    });


    // PREV MONTH ==============================================================================================
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
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay);
    });


    // CLICK CELL (SELECT DAY) =================================================================================
    $('td').click(function(){
        if ($(this).attr('id')){
            $.ajax({
                type: 'get',
                url: '/get-appointment-data',
                data: {year: currentYear, month: currentMonth+1, day: $(this).attr('id')},
                success: function(data){
                    if (data.appCount == 0)
                        $('#no-app').css({'display':'inherit'});
                    else{
                        $('#no-app').css({'display':'none'});
                        for (let i = 0; i < data.appCount; i++){
                            DrawItems(data.app[i]);
                        }
                    }
                }
            });

            $('.list').fadeIn();
            $('#list-date').html('<strong>' + $(this).attr('id') + ' ' + month[currentMonth] + ' ' + currentYear + '</strong>');
        }
    });


    // CLOSE APPOINTMENT LIST ==================================================================================
    $('#list-close').click(function(){
        $('.list').fadeOut();
        let list_items = document.getElementById('list-items');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
    });


    $("#list-items").on('click','button', function(){
        alert($(this).attr('id'));
    });
});





// DYNAMICALLY CREATE APPOINTMENT INFO =================================================================================================
function DrawItems(app)
{
    const list_items = document.getElementById('list-items');
    const img_src = '/icon/';

    let list_row = document.createElement('div');
    list_row.setAttribute('class', 'list-row');
    list_row.setAttribute('id', 'list-row' + app['id']);
    list_items.appendChild(list_row);


    // Hour -----------------------------
    let container = document.createElement('div');
    container.setAttribute('class', 'd-flex align-items-center mx-5 my-3');
    list_row.appendChild(container);

    let img = document.createElement('img');
    img.setAttribute('class', 'mr-2');
    img.setAttribute('src', img_src+'clock.png');
    container.appendChild(img);

    let h5 = document.createElement('h5');
    h5.setAttribute('id', 'app-hour' + app['id']);
    h5.innerHTML = app['start_at'].substring(0,5) + ' - ' +  app['end_at'].substring(0,5);
    container.appendChild(h5);


    // Client ----------------------------
    container = document.createElement('div');
    container.setAttribute('class', 'd-flex align-items-center mx-5 my-3');
    list_row.appendChild(container);

    img = document.createElement('img');
    img.setAttribute('class', 'mr-2');
    img.setAttribute('src', img_src+'barbers.png');
    container.appendChild(img);

    let h4 = document.createElement('h4');
    h4.setAttribute('id', 'app-name' + app['id']);
    h4.innerHTML =  app['client_name'] + ' - ';
    container.appendChild(h4);

    h4 = document.createElement('h4');
    h4.setAttribute('id', 'app-pack' + app['id']);

    let pack = '';
    for (let i = 1; i <= 6; i++){
        if (app['package_'+i] != 0)
            pack = pack + ' Pack ' + i + ', ';
    }
    
    h4.innerHTML =  pack.substring(0, pack.length-2);
    container.appendChild(h4);


    // Phone ------------------------
    container = document.createElement('div');
    container.setAttribute('class', 'd-flex align-items-center mx-5 my-3');
    list_row.appendChild(container);

    img = document.createElement('img');
    img.setAttribute('class', 'mr-2');
    img.setAttribute('src', img_src+'phone.png');
    container.appendChild(img);

    h5 = document.createElement('h5');
    h5.setAttribute('id', 'app-phone' + app['id']);
    h5.innerHTML =  app['client_phone'];
    container.appendChild(h5);


    // Price -----------------------
    container = document.createElement('div');
    container.setAttribute('class', 'd-flex align-items-center mx-5 my-3');
    list_row.appendChild(container);

    img = document.createElement('img');
    img.setAttribute('class', 'mr-2');
    img.setAttribute('src', img_src+'cash.png');
    container.appendChild(img);

    h5 = document.createElement('h5');
    h5.setAttribute('id', 'app-price' + app['id']);
    h5.innerHTML =  app['total_price'] + ' LEI';
    container.appendChild(h5);


    // Buttons ------------------------
    container = document.createElement('div');
    container.setAttribute('class', 'd-flex align-items-center mx-5 mt-5');
    list_row.appendChild(container);

    let edit_btn = document.createElement('button');
    edit_btn.setAttribute('type', 'button');
    edit_btn.setAttribute('class', 'mybtn');
    edit_btn.setAttribute('id', 'edit' + app['id']);
    edit_btn.innerHTML = 'Edit';
    container.appendChild(edit_btn);

    let remove_btn = document.createElement('button');
    remove_btn.setAttribute('type', 'button');
    remove_btn.setAttribute('class', 'mybtn ml-3');
    remove_btn.setAttribute('id', 'remove' + app['id']);
    remove_btn.innerHTML = 'Remove';
    container.appendChild(remove_btn);

}





// ARRANGE DAYS BY MONTHS ================================================================================================
function DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay)
{
    let td = document.querySelectorAll('td');
    let day = 1;
    let app_days = [];
    
    for (let i = 0; i < 42; i++)
        app_days[i] = 0;

    $.ajax({
        type: 'get',
        url: '/get-appointment-days',
        data: {year: currentYear, month: currentMonth+1},
        async: false,
        success: function(data){
            for (let i=0; i<data.appDaysCount; i++){
                app_days[data.appDays[i]['day']] = 1;
            }
        }
    });


    for (let i = 0; i < 42; i++)
    {            
        if ((i < firstDayOfMonth) || (day > daysInMonth))
        {
            $(td[i]).html('');
            $(td[i].setAttribute('id', ''));
            $(td[i].setAttribute('class', ''));
        }
        
        if ((i >= firstDayOfMonth) && (day <= daysInMonth))
        {
            if(app_days[day] == 1)  
                if ((day == currentDay) && (new Date().getMonth() == currentMonth))                
                    $(td[i].setAttribute('class', 'active app-day today'));
                else
                    $(td[i].setAttribute('class', 'active app-day'));
            else
                $(td[i].setAttribute('class', 'active'));
            

            $(td[i]).html('<strong>' + day + '</strong>');
            $(td[i].setAttribute('id', day));
            day++;
        }
    }
}