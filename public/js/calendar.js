const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const maxServices = 6;
const timeForService = [35, 40, 80, 15, 60, 55];
const priceForService = [50, 40, 75, 20, 40, 45];
const startWorkProgram = 10;
const endWorkProgram = 18;


$(document).ready(function(){
    // CREATE DAYS FOR THE CURRENT MONTH ======================================================================
    var currentDate = new Date();
    var currentDay = currentDate.getUTCDate();                               
    var currentMonth = currentDate.getUTCMonth();                            // 0-11
    var currentYear = currentDate.getUTCFullYear();                          
    var firstDayOfMonth = new Date(currentYear, currentMonth).getUTCDay();   // 0..6 (Sunday..Saturday)
    var daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();    // 1-31
    var tempDate = '';
    var removeId = '';
    var selectDay = '';
    var user = $('.header span').text()
    user = user.substring(8, user.length);

    $('#header-date').html(month[currentMonth]+' '+currentYear);
    DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);



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
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
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
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
    });


    // CLICK CELL (SELECT DAY) =================================================================================
    $('td').click(function(){
        selectDay = $(this).attr('id');

        if (selectDay){
            $.ajax({
                type: 'get',
                url: '/get-appointment-data',
                data: {year: currentYear, month: currentMonth+1, day: selectDay, user: user},
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
            $('#list-date').html('<strong>' + selectDay + ' ' + month[currentMonth] + ' ' + currentYear + '</strong>');
        }
    });


    // CLOSE APPOINTMENT LIST ==================================================================================
    $('#list-close').click(function(){
        CloseWindow();
    });


    //  REMOVE APPOINTMENT =====================================================================================
    $("#list-items").on('click','.remove', function(){
        $('.remove-window').fadeIn();
        $('.edit').prop('disabled', true);
        $('.remove').prop('disabled', true);
        removeId = $(this).attr('id');
    });

    $(".remove-window").on('click','#remove-cancel', function(){
        $('.remove-window').fadeOut();
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
    });

    $(".remove-window").on('click','#remove-yes', function(){
        $.ajax({
            type: 'get',
            url: '/remove',
            data: {id: removeId, user: user},
            success: function(data){
                $('.remove-window').fadeOut();
                CloseWindow();
                DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
            }
        });
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
    });


    // EDIT APPOINTMENT ========================================================================================
    $("#list-items").on('click','.edit', function(){
        DefaultEditData($(this).attr('id'), currentYear, currentMonth+1, selectDay, user);
        $('.edit-window').fadeIn();
        $('.edit').prop('disabled', true);
        $('.remove').prop('disabled', true);
        
    });

    // CHECKBOX FROM EDIT WINDOW ===============================================================================
    $('.selectpack').click(function(){
        let pack = $(this).attr('id');

        for (let i = 1; i <= 6; i++)
        {
            if ((pack == 'pack'+i) && ($('#check'+i).is(':checked') == false))
                $('#check'+i).prop("checked", true);
            else if ((pack == 'pack'+i) && ($('#check'+i).is(':checked') == true))
                $('#check'+i).prop("checked", false);
        }
    });


    // APPLY EDIT WINDOW =======================================================================================
    $('.edit-apply').click(function(){
        $('.edit-window').fadeOut();
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
        CloseWindow();
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
    });



    // CLOSE EDIT WINDOW  ======================================================================================
    $('#edit-close').click(function(){
        $('.edit-window').fadeOut();
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
    });

    $('.edit-cancel').click(function(){
        $('.edit-window').fadeOut();
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
    });
    
});





// MY FUNCTIONS ======================================================================================================================
//====================================================================================================================================
//====================================================================================================================================
// CLOSE APPOINTMENT LIST WINDOW =====================================================================================================
function CloseWindow()
{
    $('.list').fadeOut();
    let list_items = document.getElementById('list-items');
    while (list_items.firstChild) {
        list_items.removeChild(list_items.firstChild);
    }
}





// SET DEFAULT DATA WHEN OPENING EDIT WINDOW =========================================================================================
function DefaultEditData(editId, currentYear, currentMonth, currentDay, user)
{    
    // Get user from users table
    $.ajax({
        type:'get',
        url:'/get-users-data',
        success: function(data){
            for(let i=0; i<data.usersCount; i++){
                let select = document.getElementById('select-user');
                let option = document.createElement('option');
                option.value = data.user[i]['name'];
                option.text = data.user[i]['name'];
                select.appendChild(option);
            }
            $('#select-user').val(user);
        }
    });

    // Get user data from user-appointment table
    $.ajax({
        type:'get',
        url:'/get-appointment-data',
        data: {year: currentYear, month: currentMonth, day: currentDay, user: user},
        success: function(data){
            let total = 0;
            let year = '';
            let month = '';
            let day = '';
            let startHour = '';
            let startMin = '';
            let endHour = '';
            let endMin = '';

            for (let i = 0; i < data.appCount; i++){
                if (data.app[i]['id'] == editId){
                    $('#client-name').val(data.app[i]['client_name']);
                    $('#client-phone').val(data.app[i]['client_phone']);
                    for (let j = 1; j <= maxServices; j++){
                        if (data.app[i]['package_'+j] == 1){
                            $('#check'+j).prop("checked", true);
                            total = total + priceForService[j-1];
                        }
                        else
                            $('#check'+j).prop("checked", false);
                    }
                    year = data.app[i]['year'];
                    month = data.app[i]['month'];
                    day = data.app[i]['day'];
                    startHour = data.app[i]['start_at'].substring(0,2);
                    startMin = data.app[i]['start_at'].substring(3,5);
                    endHour = data.app[i]['end_at'].substring(0,2);
                    endMin = data.app[i]['end_at'].substring(3,5);

                    $('#edit-total').html('Total: ' + total + ' LEI');
                } 
            }
            CreateOption('select-year', currentYear, currentYear+1, 1, year);
            CreateOption('select-month', currentMonth, 12, 1, month);
            CreateOption('select-day', currentDay, 28, 1, day);
            CreateOption('select-start-hour', startHour, endWorkProgram, 1, startHour);
            CreateOption('select-start-min', startMin, 55, 5, startMin);
            CreateOption('select-end-hour', endHour, endWorkProgram, 1, endHour);
            CreateOption('select-end-min', endMin, 55, 5, endMin);
        }
    });
}






// DYNAMICALLY CREATE SELECT OPTION FOR EDIT WINDOW=====================================================================================
function CreateOption(documentId, startVal, endVal, step, selectedVal)
{
    for(let i = parseInt(startVal); i <= parseInt(endVal); i = i+step){
        let option = document.createElement('option');
        if (((documentId == 'select-start-hour') || (documentId == 'select-start-min')) && (i < 10)){
            option.value = '0'+i;
            option.text = '0'+i;
        }
        else if (((documentId == 'select-end-hour') || (documentId == 'select-end-min')) && (i < 10)){
            option.value = '0'+i;
            option.text = '0'+i;
        }
        else{
            option.value = i;
            option.text = i;
        }
        document.getElementById(documentId).appendChild(option);
    }
    $('#'+documentId).val(selectedVal);
}






// DYNAMICALLY CREATE APPOINTMENT INFO =================================================================================================
function DrawItems(app)
{
    const list_items = document.getElementById('list-items');
    const img_src = '/icon/';

    let list_row = document.createElement('div');
    list_row.setAttribute('class', 'list-row');
    list_row.setAttribute('id', app['id']);
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
    edit_btn.setAttribute('class', 'mybtn edit');
    edit_btn.setAttribute('id', app['id']);
    edit_btn.innerHTML = 'Edit';
    container.appendChild(edit_btn);

    let remove_btn = document.createElement('button');
    remove_btn.setAttribute('type', 'submit');
    remove_btn.setAttribute('class', 'mybtn ml-3 remove');
    remove_btn.setAttribute('id', app['id']);
    remove_btn.innerHTML = 'Remove';
    container.appendChild(remove_btn);

}





// ARRANGE DAYS BY MONTHS ================================================================================================
function DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user)
{
    let td = document.querySelectorAll('td');
    let day = 1;
    let app_days = [];
    
    for (let i = 0; i < 42; i++)
        app_days[i] = 0;

    $.ajax({
        type: 'get',
        url: '/get-appointment-days',
        data: {year: currentYear, month: currentMonth+1, user: user},
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
            else if ((day == currentDay) && (new Date().getMonth() == currentMonth))
                $(td[i].setAttribute('class', 'active today'));
            else
                $(td[i].setAttribute('class', 'active'));
            

            $(td[i]).html('<strong>' + day + '</strong>');
            $(td[i].setAttribute('id', day));
            day++;
        }
    }
}