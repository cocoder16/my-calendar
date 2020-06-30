# my-calendar

This is not a module but just a source code which store the idea to make a calendar module later.

# how to use

Copy lib or source code and paste it into proper space on your project.
Only two methods exists. 

```
myCalendar.create(parentNode, isTodayBtn, callback);
myCalendar.createMini(parentNode, isTodayBtn, callback);
```

A calendar which made by ```created()``` is bigger than the other one which made by ```createMini()```.
But If you modify some CSS, the distinction is not pointless.

|parameter|type|description|
|---------|----|-----------|
|parentNode|Object|A calendar will be created under this Element Node.|
|[isTodayBtn]|Boolean|If this value is true, a button will be created with calendar which has click event listener. so if user click this button, the calendar reset to the today date.|
|[callback]|Function|The callback will be running after printing a calendar.|

You can get the date value selected by users.

```
var ex = myCalendar.create(parentNode);
console.log(ex.selectedDay);
```

When you create a calendar with ```create()``` or ```createMini()```, you can assign the return value to a variable. The return value is a Object which has properties that ```selectedDay, viewDay``` and so on.
The ```selectedDay``` has ```year, month and date``` value which user has chosen.
And The ```viewDay``` has ```year, month``` value which are shown on the window.

