"use strict";

// 오늘 옵션, mini 옵션, 콜백, scss, webpack,
var myCalendar = function () {
  //// 선언
  //기본 데이터
  var dateCountArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //날짜 초기화 함수

  var initialize = function initialize(obj) {
    var d = new Date();
    obj.year = d.getFullYear();
    obj.month = d.getMonth() + 1;
    obj.date = d.getDate();
  }; //연도 이동 함수


  var prevYear = function prevYear(calendar) {
    calendar.viewDay.year -= 1;
    recreate(calendar);
  };

  var nextYear = function nextYear(calendar) {
    calendar.viewDay.year += 1;
    recreate(calendar);
  }; //월 이동 함수


  var prevMonth = function prevMonth(calendar) {
    calendar.viewDay.month -= 1;
    recreate(calendar);
  };

  var nextMonth = function nextMonth(calendar) {
    calendar.viewDay.month += 1;
    recreate(calendar);
  }; //날짜 클릭하면 선택되는 함수


  var selectDay = function selectDay(tar, calendar) {
    var selectedDay = calendar.selectedDay,
        viewDay = calendar.viewDay;
    selectedDay.year = viewDay.year;
    selectedDay.month = viewDay.month;
    selectedDay.date = tar.textContent;
    var selected = calendar.parent.querySelector('.selected');

    if (selected) {
      selected.classList.remove('selected');
    }

    tar.classList.add('selected');
  }; //오늘 클릭하면


  var goToday = function goToday(calendar) {
    initialize(calendar.viewDay);
    initialize(calendar.selectedDay);
    recreate(calendar);
  }; // creater


  var removeAllChildNode = function removeAllChildNode(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }; //달력 본체 만들기


  var generateTemplate = function generateTemplate() {
    var node = document.createElement('div');
    node.className = 'my-calendar';
    var template = "\n            <div class='control-wrap'>\n                <div class='btn-cell'>\n                    <button type=\"button\" class=\"prev year\"></button>\n                </div>\n                <div class='output year'><span></span></div>\n                <div class='btn-cell'>\n                    <button type=\"button\" class=\"next year\"></button>\n                </div>\n                <div></div>\n                <div class='btn-cell'>\n                    <button type=\"button\" class=\"prev month\"></button>\n                </div>\n                <div class='output month'><span></span></div>\n                <div class='btn-cell'>\n                    <button type=\"button\" class=\"next month\"></button>\n                </div>\n            </div>\n            <table>\n                <thead>\n                    <tr>\n                        <th>\uC77C</th>\n                        <th>\uC6D4</th>\n                        <th>\uD654</th>\n                        <th>\uC218</th>\n                        <th>\uBAA9</th>\n                        <th>\uAE08</th>\n                        <th>\uD1A0</th>\n                    </tr>\n                </thead>\n                <tbody class='calendar-body'>\n                </tbody>\n            </table>\n            <button type=\"button\" class=\"today-btn\">\uC624\uB298</button>\n        ";
    node.innerHTML = template;
    return node;
  }; //달력 만들기 함수


  var createBone = function createBone(calendar) {
    var parent = calendar.parent;
    var tdArr = calendar.tdArr;
    var template = generateTemplate();
    parent.appendChild(template);
    var calbody = parent.querySelector(".my-calendar .calendar-body"); //버튼 이벤트

    parent.querySelector('.prev.year').addEventListener('click', function () {
      prevYear(calendar);
    });
    parent.querySelector('.next.year').addEventListener('click', function () {
      nextYear(calendar);
    });
    parent.querySelector('.prev.month').addEventListener('click', function () {
      prevMonth(calendar);
    });
    parent.querySelector('.next.month').addEventListener('click', function () {
      nextMonth(calendar);
    });
    parent.querySelector('.today-btn').addEventListener('click', function () {
      goToday(calendar);
    }); //달력 테이블 만들기

    for (var i = 0; i < 6; i++) {
      tdArr[i] = new Array(7);
    }

    for (var i = 0; i < 6; i++) {
      var tr = document.createElement('tr');

      for (var j = 0; j < 7; j++) {
        var td = document.createElement('td');
        tr.appendChild(td);
        tdArr[i][j] = td;
      }

      calbody.appendChild(tr);
    }
  }; //달력 출력 함수


  var creater = function creater(calendar) {
    var parent = calendar.parent,
        viewDay = calendar.viewDay,
        selectedDay = calendar.selectedDay,
        tdArr = calendar.tdArr;
    removeAllChildNode(parent);
    createBone(calendar); //컨트롤바 연월 바꾸기 viewDay의 프로퍼티값을 동적으로 바꾸는 것이고 다른 코드에 영향을 미치기 때문에 맨 위에 올림.

    (function showControlbar() {
      var output_year = parent.querySelector(".my-calendar .output.year span");
      var output_month = parent.querySelector(".my-calendar .output.month span");
      var prev_year = parent.querySelector(".my-calendar .prev.year");

      if (viewDay.year <= 1) {
        prev_year.setAttribute('disabled', true);
      } else {
        prev_year.removeAttribute('disabled');
      }

      if (viewDay.month === 0) {
        viewDay.year -= 1;
        viewDay.month = 12;
      } else if (viewDay.month === 13) {
        viewDay.year += 1;
        viewDay.month = 1;
      } // 연월 출력


      var updateTextNode = function updateTextNode(node, text) {
        node.textContent = '';
        var textNode = document.createTextNode(text);
        node.appendChild(textNode);
      };

      updateTextNode(output_year, "".concat(viewDay.year, " \uB144"));

      if (viewDay.month < 10) {
        updateTextNode(output_month, "0".concat(viewDay.month, " \uC6D4"));
      } else {
        updateTextNode(output_month, "".concat(viewDay.month, " \uC6D4"));
      }
    })(); //선택되어있는 날짜 받아와서 윤년인지 계산


    (function isLeepYear() {
      if (viewDay.year % 4 === 0 && viewDay.year % 100 !== 0 || viewDay.year % 400 === 0) {
        //윤년이면
        //윤년
        dateCountArr[1] = 29;
      } else {
        //윤년이 아니면
        //평년
        dateCountArr[1] = 28;
      }
    })();

    (function setMaxDate() {
      viewDay.maxdate = dateCountArr[viewDay.month - 1];
    })(); //요일계산


    var leapCount = parseInt((viewDay.year - 1) / 4) - parseInt((viewDay.year - 1) / 100) + parseInt((viewDay.year - 1) / 400); //작년까지 윤년의 개수를 셈

    var firstDay = (viewDay.year + leapCount) % 7; //1월1일의 요일

    var sumDate = 0;

    for (var i = 0; i < viewDay.month - 1; i++) {
      sumDate += dateCountArr[i];
    }

    var firstMonthDay = (firstDay + sumDate) % 7; //viewMonth 1일의 요일
    //달력 출력

    var handleClickCell = function handleClickCell() {
      selectDay(this, calendar);
    };

    var dateCount = 1;

    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstMonthDay || dateCount > dateCountArr[viewDay.month - 1]) {
          tdArr[i][j].textContent = '';
          tdArr[i][j].removeAttribute('class');
          tdArr[i][j].removeEventListener('click', handleClickCell);
          tdArr[i][j].classList.remove('selected');
        } else {
          tdArr[i][j].textContent = dateCount;
          tdArr[i][j].setAttribute('class', "date_".concat(dateCount));
          tdArr[i][j].addEventListener('click', handleClickCell);

          if (dateCount === selectedDay.date && viewDay.month === selectedDay.month && viewDay.year === selectedDay.year) {
            tdArr[i][j].classList.add('selected');
          } else {
            tdArr[i][j].classList.remove('selected');
          }

          dateCount++;
        }
      }
    }
  };

  var create = function create(parent) {
    // 달력생성
    var calendar = {
      parent: parent,
      //달력이 위치할 부모노드
      viewDay: {},
      //달력에 보여지는 날짜
      selectedDay: {},
      //사용자가 클릭한 날짜
      tdArr: [] //달력테이블셀

    }; //뷰 날짜 초기화

    initialize(calendar.viewDay);
    initialize(calendar.selectedDay);
    creater(calendar);
    return calendar; //변수에 할당해서 calendar 겍체에 접근할 수 있게 해줌.
  };

  var recreate = function recreate(calendar) {
    creater(calendar);
  };

  return {
    create: create
  };
}();