var mini = document.querySelector('#mini');
var mini_tb = document.querySelector('#mini-tb');
var big = document.querySelector('#big');
var big_tb = document.querySelector('#big-tb');

myCalendar.createMini(mini);
myCalendar.createMini(mini_tb, true);
myCalendar.create(big);
var ex = myCalendar.create(big_tb, true, function(){
    console.log('asynchronous');
});
console.log(ex);