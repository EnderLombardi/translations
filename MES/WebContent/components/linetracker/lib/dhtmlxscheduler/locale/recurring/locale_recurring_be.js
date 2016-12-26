/*
@license
dhtmlxScheduler v.4.3.1 

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.__recurring_template='<div class="dhx_form_repeat"> <form> <div class="dhx_repeat_left"> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="day" />Дзень</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="week"/>Тыдзень</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="month" checked />Месяц</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="repeat" value="year" />Год</label> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_center"> <div style="display:none;" id="dhx_repeat_day"> <label><input class="dhx_repeat_radio" type="radio" name="day_type" value="d"/>Кожны</label><input class="dhx_repeat_text" type="text" name="day_count" value="1" />дзень<br /> <label><input class="dhx_repeat_radio" type="radio" name="day_type" checked value="w"/>Кожны працоўны дзень</label> </div> <div style="display:none;" id="dhx_repeat_week"> Паўтараць кожны<input class="dhx_repeat_text" type="text" name="week_count" value="1" />тыдзень<br /> <table class="dhx_repeat_days"> <tr> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="1" />Панядзелак</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="4" />Чацвер</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="2" />Аўторак</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="5" />Пятніцу</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="3" />Сераду&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><br /> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="6" />Суботу</label> </td> <td> <label><input class="dhx_repeat_checkbox" type="checkbox" name="week_day" value="0" />Нядзелю</label><br /><br /> </td> </tr> </table> </div> <div id="dhx_repeat_month"> <label><input class="dhx_repeat_radio" type="radio" name="month_type" value="d"/>Паўтараць</label><input class="dhx_repeat_text" type="text" name="month_day" value="1" /> чысла кожнага<input class="dhx_repeat_text" type="text" name="month_count" value="1" />месяцу<br /> <label><input class="dhx_repeat_radio" type="radio" name="month_type" checked value="w"/></label><input class="dhx_repeat_text" type="text" name="month_week2" value="1" /><select name="month_day2"><option value="1" selected >Панядзелак<option value="2">Аўторак<option value="3">Серада<option value="4">Чацвер<option value="5">Пятніца<option value="6">Субота<option value="0">Нядзеля</select>кожны <input class="dhx_repeat_text" type="text" name="month_count2" value="1" />месяц<br /> </div> <div style="display:none;" id="dhx_repeat_year"> <label><input class="dhx_repeat_radio" type="radio" name="year_type" value="d"/></label><input class="dhx_repeat_text" type="text" name="year_day" value="1" />день<select name="year_month"><option value="0" selected >Студзеня<option value="1">Лютага<option value="2">Сакавіка<option value="3">Красавіка<option value="4">Мая<option value="5">Чэрвеня<option value="6">Ліпeня<option value="7">Жніўня<option value="8">Верасня<option value="9">Кастрычніка<option value="10">Лістапада<option value="11">Снежня</select><br /> <label><input class="dhx_repeat_radio" type="radio" name="year_type" checked value="w"/></label><input class="dhx_repeat_text" type="text" name="year_week2" value="1" /><select name="year_day2"><option value="1" selected >Панядзелак<option value="2">Аўторак<option value="3">Серада<option value="4">Чацвер<option value="5">Пятніца<option value="6">Субота<option value="0">Нядзеля</select><select name="year_month2"><option value="0" selected >Студзеня<option value="1">Лютага<option value="2">Сакавіка<option value="3">Красавіка<option value="4">Мая<option value="5">Чэрвеня<option value="6">Лiпeня<option value="7">Жніўня<option value="8">Верасня<option value="9">Кастрычніка<option value="10">Лістапада<option value="11">Снежня</select><br /> </div> </div> <div class="dhx_repeat_divider"></div> <div class="dhx_repeat_right"> <label><input class="dhx_repeat_radio" type="radio" name="end" checked/>Без даты заканчэння</label><br /> <label><input class="dhx_repeat_radio" type="radio" name="end" /></label><input class="dhx_repeat_text" type="text" name="occurences_count" value="1" />паўтораў<br /> <label><input class="dhx_repeat_radio" type="radio" name="end" />Да </label><input class="dhx_repeat_date" type="text" name="date_of_end" value="'+e.config.repeat_date_of_end+'" /><br /> </div> </form> </div> <div style="clear:both"> </div>';

});
//# sourceMappingURL=../../sources/locale/recurring/locale_recurring_be.js.map