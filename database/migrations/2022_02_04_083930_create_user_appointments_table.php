<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_appointments', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->string('client_name');
            $table->string('client_phone');
            $table->date('date');
            $table->time('start_at');
            $table->time('end_at');
            $table->boolean('package_1')->default(false);
            $table->boolean('package_2')->default(false);
            $table->boolean('package_3')->default(false);
            $table->boolean('package_4')->default(false);
            $table->boolean('package_5')->default(false);
            $table->boolean('package_6')->default(false);
            $table->smallInteger('total_price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_appointments');
    }
}
