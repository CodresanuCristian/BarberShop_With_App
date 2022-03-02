const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const countServices = 6;
const timeForService = [35, 40, 80, 15, 60, 55];
const priceForService = [50, 40, 75, 20, 40, 45];
const startWorking = 10;
const endWorking = 18;
const stepMin = 5; // the clock every 'stepMin' min
const workingRange = endWorking - startWorking;



$(document).ready(function(){
    var currentDate = new Date();
    var currentDay = currentDate.getUTCDate();                               
    var currentMonth = currentDate.getUTCMonth();                            // 0-11
    var currentYear = currentDate.getUTCFullYear();                          
    var firstDayOfMonth = new Date(currentYear, currentMonth).getUTCDay();   // 0..6 (Sunday..Saturday)
    var daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();    // 1-31
    var tempDate = '';
    var editId = '';
    var removeId = '';
    var selectDay = '';
    var user = $('.header span').text()
    user = user.substring(8, user.length);








    // ==============================================================================================================
    // CALENDAR CONTROL =============================================================================================
    // ==============================================================================================================

    // CREATE DEFAULT CALENDAR (CURRENT MONTH) ======================================================================
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







    // ==============================================================================================================
    // APPOINTMENT LIST CONTROL =====================================================================================
    // ==============================================================================================================
    
    // CLICK CELL (SELECT DAY) - OPEN APPOINTMENT LIST =================================================================================
    $('td').click(function(){
        selectDay = $(this).attr('id');

        if (selectDay){
            let data = GetAppointmentData(currentYear, currentMonth+1, selectDay, user);
            
            if (data.count == 0)
                $('#no-app').css({'display':'inherit'});
            else{
                $('#no-app').css({'display':'none'});
                for (let i = 0; i < data.count; i++)
                    DrawItems(data.app[i]);
            }

            $('.list').fadeIn();
            $('#list-date').html('<strong>' + selectDay + ' ' + month[currentMonth] + ' ' + currentYear + '</strong>');
        }
    });


    // CLOSE APPOINTMENT LIST ==================================================================================
    $('#list-close').click(function(){
        CloseList();
    });


    //  REMOVE APPOINTMENT - OPEN REMOVE WINDOW ================================================================
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
                CloseList();
                DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
            }
        });
        $('.edit').prop('disabled', false);
        $('.remove').prop('disabled', false);
    });


    // EDIT APPOINTMENT - OPEN EDIT WINDOW =====================================================================
    $("#list-items").on('click','.edit', function(){
        editId = $(this).attr('id');
        $('.edit-window').fadeIn(function(){
            DefaultEditData(editId, currentYear, currentMonth+1, selectDay, user);
        });
        $('.edit').prop('disabled', true);
        $('.remove').prop('disabled', true); 
    });



    // SELECT CHECKBOX
    $('.selectpack').click(function(){
        let pack = $(this).attr('id');
        let total = 0;
        let time = 0;

        for (let i = 1; i <= 6; i++){
            if (((pack == 'pack'+i) || (pack == 'check'+i))&& ($('#check'+i).is(':checked') == false))
                $('#check'+i).prop("checked", true);
            else if ((pack == 'pack'+i) && ($('#check'+i).is(':checked') == true))
                $('#check'+i).prop("checked", false);
        }

        for (let i = 1; i <= 6; i++)
            if ($('#check'+i).is(":checked") == true){
                total = total + priceForService[i-1];
                time = time + timeForService[i-1];
            }

        let h = parseInt(time / 60);
        let m = time % 60;
        $('#edit-time').html('Time: ' + h +'h ' + m + 'min');
        $('#edit-total').html('Total: ' + total + ' LEI');
    });



    // SELECT OPTION
    $('#select-year').click(function(){
        for (let i=0; i<10; i++){
            let select = document.getElementById('select-year');
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            select.appendChild(option);
        }
    });



    // CLOSE EDIT WINDOW  ======================================================================================
    $('#edit-close').click(function(){
        CloseEdit();
    });

    $('.edit-cancel').click(function(){
        CloseEdit();
    });

    


    // APPLY EDIT WINDOW =======================================================================================
    $('.edit-apply').click(function(){
        CloseEdit();
        CloseList();
        ApplyEdit(editId);
        DrawCalendar(firstDayOfMonth, daysInMonth, currentYear, currentMonth, currentDay, user);
    });

});








// ===============================================================================================================================
// MY FUNCTIONS ==================================================================================================================
// ===============================================================================================================================

// GET APPOINTMENT DATA ==========================================================================================================
function GetAppointmentData(currentYear, currentMonth, selectDay, user)
{
    let count;
    let app;

    $.ajax({
        type: 'get',
        url: '/get-appointment-data',
        async: false,
        data: {year: currentYear, month: currentMonth, day: selectDay, user: user},
        success: function(data){
            count = data.appCount;
            app = data.app;
        }
    });

    return {count, app};
}


// GET USER DATA ===================================================================================================================
function GetUserData()
{
    let count;
    let user;

    $.ajax({
        type:'get',
        url:'/get-users-data',
        async: false,
        success: function(data){
            count = data.usersCount;
            user = data.users;
        }
    });

    return {count, user};
}




// DEFAULT DATA WHEN OPENING EDIT WINDOW ===========================================================================================
function DefaultEditData(editId, currentYear, currentMonth, selectDay, currentUser)
{
    let usersData = GetUserData();
    let appData = GetAppointmentData(currentYear, currentMonth, selectDay, currentUser);

    
    // Barber select
    for(let i = 0; i < usersData.count; i++){
        let select = document.getElementById('select-user');
        let option = document.createElement('option');
        option.value = usersData.user[i]['name'];
        option.text = usersData.user[i]['name'];
        select.appendChild(option);
    }
    $('#select-user').val(currentUser);
    

    // Client name input, Phone input, Services check boxes
    for (let i = 0; i < appData.count; i++){
        if (appData.app[i]['id'] == editId)
        {
            let total = 0;
            let time = 0;

            $('#client-name').val(appData.app[i]['client_name']);
            $('#client-phone').val(appData.app[i]['client_phone']);
            for (let j = 1; j <= countServices; j++){
                if (appData.app[i]['package_'+j] == 1){
                    $('#check'+j).prop("checked", true);
                    total = total + priceForService[j-1];
                    time = time + timeForService[j-1];
                }
                else
                    $('#check'+j).prop("checked", false);
            }

            let h = parseInt(time / 60);
            let m = time % 60;
            $('#edit-time').html('Time: ' + h +'h ' + m + 'min');
            $('#edit-total').html('Total: ' + total + ' LEI');


            // Data and time
            let select = document.getElementById('select-year');
            let option = document.createElement('option');
            option.value = appData.app[i]['year'];
            option.text = appData.app[i]['year'];
            select.appendChild(option);
            $('#select-year').val(currentYear);

            select = document.getElementById('select-month');
            option = document.createElement('option');
            option.value = appData.app[i]['month'];
            option.text = appData.app[i]['month'];
            select.appendChild(option);
            $('#select-month').val(currentMonth);

            select = document.getElementById('select-day');
            option = document.createElement('option');
            option.value = appData.app[i]['day'];
            option.text = appData.app[i]['day'];
            select.appendChild(option);
            $('#select-day').val(selectDay);

            select = document.getElementById('select-start-hour');
            option = document.createElement('option');
            option.value = appData.app[i]['start_at'].substring(0,2);
            option.text = appData.app[i]['start_at'].substring(0,2);
            select.appendChild(option);
            $('#select-start-hour').val(option.text);

            select = document.getElementById('select-start-min');
            option = document.createElement('option');
            option.value = appData.app[i]['start_at'].substring(3,5);
            option.text = appData.app[i]['start_at'].substring(3,5);
            select.appendChild(option);
            $('#select-start-min').val(option.text);

            select = document.getElementById('select-end-hour');
            option = document.createElement('option');
            option.value = appData.app[i]['end_at'].substring(0,2);
            option.text = appData.app[i]['end_at'].substring(0,2);
            select.appendChild(option);
            $('#select-end-hour').val(option.text);

            select = document.getElementById('select-end-min');
            option = document.createElement('option');
            option.value = appData.app[i]['end_at'].substring(3,5);
            option.text = appData.app[i]['end_at'].substring(3,5);
            select.appendChild(option);
            $('#select-end-min').val(option.text);
        }
    }
}







// CLOSE APPOINTMENT WINDOW AND REMOVE ALL DATA =================================================================
function CloseList()
{
    $('.list').fadeOut();

    let list_items = document.getElementById('list-items');
    while (list_items.firstChild) {
        list_items.removeChild(list_items.firstChild);
    }
}




// CLOSE EDIT WINDOW AND REMOVE ALL DATA =================================================================
function CloseEdit()
{
    $('.edit').prop('disabled', false);
    $('.remove').prop('disabled', false);

    $('.edit-window').fadeOut(function(){
        let list_items = document.getElementById('select-user');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-year');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-month');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-day');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-start-hour');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-start-min');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-end-hour');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }
        list_items = document.getElementById('select-end-min');
        while (list_items.firstChild) {
            list_items.removeChild(list_items.firstChild);
        }

        $('#client-name').val('');
        $('#client-phone').val('');
        for (let j = 1; j <= countServices; j++)
            $('#check'+j).prop("checked", false);
        $('#edit-time').html('Time: ');
        $('#edit-total').html('Total: ');
    });
}





// APPLY EDIT WINDOW ===========================================================================================
function ApplyEdit(editId)
{

    let edit_user = $('#select-user').val();
    let edit_client_name = $('#client-name').val();
    let edit_client_phone = $('#client-phone').val();
    let edit_year = $('#select-year').val();
    let edit_month = $('#select-month').val();
    let edit_day = $('#select-day').val();
    let edit_start_at = $('#select-start-hour').val() + ':' + $('#select-start-min').val();
    let edit_end_at = $('#select-end-hour').val() + ':' + $('#select-end-min').val();
    let edit_package = [];

    for (let i=1; i<=countServices; i++)
        if ($('#check'+i).is(':checked')) edit_package[i] = 1;
        else                              edit_package[i] = 0;

    $.ajax({
        type:'get',
        url:'/apply-edit',
        data: {
            id: editId,
            user: edit_user, 
            client_name: edit_client_name,
            client_phone: edit_client_phone,
            year: edit_year,
            month: edit_month,
            day: edit_day,
            start_at: edit_start_at,
            end_at: edit_end_at,
            package: edit_package,
            countPackage: countServices
        },
        success: function(data){
            // alert(data.status);
        }
    });
}






// DRAW CALENDAR ================================================================================================
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




// DYNAMICALLY CREATE APPOINTMENT INFO BY SELECTED DAY =================================================================================================
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