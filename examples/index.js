var mini = document.querySelector('#mini');
var mini_tb = document.querySelector('#mini-tb');
var big = document.querySelector('#big');
var big_tb = document.querySelector('#big-tb');

var ex = myCalendar.createMini(mini, false, function(){
    console.log('asynchronous');
});
console.log(ex);
myCalendar.createMini(mini);
myCalendar.createMini(mini_tb, true);
myCalendar.create(big);
myCalendar.create(big_tb, true);
