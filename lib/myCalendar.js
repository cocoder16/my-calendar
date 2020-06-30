// 오늘 옵션o, mini 옵션o, 콜백o, cssㅇ, cross browsingㅇ, webpack,
// 콜백 - 달력선택직후o

var myCalendar = (function () {
    //// 선언
    //기본 데이터
    var dateCountArr = [31,28,31,30,31,30,31,31,30,31,30,31];

    //날짜 초기화 함수
    var initialize = function (obj) {
        var d = new Date();
        obj.year = d.getFullYear();
        obj.month = (d.getMonth() + 1);
        obj.date = d.getDate();
    }

    //연도 이동 함수
    var prevYear = function (calendar) {
        calendar.viewDay.year -= 1;
        recreate(calendar);
    };
    var nextYear = function (calendar) {
        calendar.viewDay.year += 1;
        recreate(calendar);
    };

    //월 이동 함수
    var prevMonth = function (calendar) {
        calendar.viewDay.month -= 1;
        recreate(calendar);
    };
    var nextMonth = function (calendar) {
        calendar.viewDay.month += 1;
        recreate(calendar);
    };

    //날짜 클릭하면 선택되는 함수
    var selectDay = function (tar, calendar) {
        var { selectedDay, viewDay } = calendar;
        selectedDay.year = viewDay.year;
        selectedDay.month = viewDay.month;
        selectedDay.date = tar.textContent*1;
        let selected = calendar.parent.querySelector('.selected');
        if (selected) {selected.classList.remove('selected');}
        tar.classList.add('selected');
    };

    //오늘 클릭하면
    var goToday = function (calendar) {
        initialize(calendar.viewDay);
        initialize(calendar.selectedDay);
        recreate(calendar);
    };

    // creater
    var removeAllChildNode = function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    //달력 본체 만들기
    var generateTemplate = function (isTodayBtn, size) {
        var node = document.createElement('div');
        if (size == 'mini') {
            node.className = 'my-calendar mini'; 
        } else {
            node.className = 'my-calendar';
        }
        var template = `
            <div class='control-wrap'>
                <div class='btn-cell'>
                    <button type="button" class="prev year"></button>
                </div>
                <div class='output year'><span></span></div>
                <div class='btn-cell'>
                    <button type="button" class="next year"></button>
                </div>
                <div></div>
                <div class='btn-cell'>
                    <button type="button" class="prev month"></button>
                </div>
                <div class='output month'><span></span></div>
                <div class='btn-cell'>
                    <button type="button" class="next month"></button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>일</th>
                        <th>월</th>
                        <th>화</th>
                        <th>수</th>
                        <th>목</th>
                        <th>금</th>
                        <th>토</th>
                    </tr>
                </thead>
                <tbody class='calendar-body'>
                </tbody>
            </table>
        `;
        if (isTodayBtn) {
            template += `<button type="button" class="today-btn">오늘</button>`;
        }
        node.innerHTML = template;
        return node
    };

    //달력 만들기 함수
    var createBone = function (calendar) {
        var parent = calendar.parent;
        var tdArr = calendar.tdArr;
        var template = generateTemplate(calendar.isTodayBtn, calendar.size);
        parent.appendChild(template);

        var calbody = parent.querySelector(".my-calendar .calendar-body");

        //버튼 이벤트
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
        if (calendar.isTodayBtn) {
            parent.querySelector('.today-btn').addEventListener('click', function () {
                goToday(calendar);
            });
        }

        //달력 테이블 만들기
        for (var i = 0; i < 6; i++){
            tdArr[i] = new Array(7);
        }
        for (var i = 0; i < 6; i++){
            var tr = document.createElement('tr');
            for (var j = 0; j < 7; j++){
                var td = document.createElement('td');
                tr.appendChild(td);
                tdArr[i][j] = td;
            }
            calbody.appendChild(tr);
        }
    };

    //달력 출력 함수
    var creater = function (calendar) {
        var { parent, viewDay, selectedDay, tdArr, size } = calendar;

        removeAllChildNode(parent);
        createBone(calendar);
        
        //컨트롤바 연월 바꾸기 viewDay의 프로퍼티값을 동적으로 바꾸는 것이고 다른 코드에 영향을 미치기 때문에 맨 위에 올림.
        (function showControlbar () {
            var output_year = parent.querySelector(".my-calendar .output.year span");
            var output_month = parent.querySelector(".my-calendar .output.month span");
            var prev_year = parent.querySelector(".my-calendar .prev.year");
            
            if (viewDay.year <= 1){
                prev_year.setAttribute('disabled', true);
            } else {
                prev_year.removeAttribute('disabled');
            }
            if (viewDay.month === 0){
                viewDay.year -= 1;
                viewDay.month = 12;
            } else if (viewDay.month === 13){
                viewDay.year += 1;
                viewDay.month = 1;
            }

            // 연월 출력
            var updateTextNode = function (node, text) {
                node.textContent = '';
                var textNode = document.createTextNode(text);
                node.appendChild(textNode);
            }

            var yearText = viewDay.year;
            var monthText;
            if (viewDay.month < 10) {
                monthText = `0${viewDay.month}`;
            } else {
                monthText = viewDay.month;
            }  
            if (size == 'big') {
                yearText += ' 년';
                monthText += ' 월';
            }

            updateTextNode(output_year, yearText);
            updateTextNode(output_month, monthText);
        })();      

        //선택되어있는 날짜 받아와서 윤년인지 계산
        (function isLeepYear () {
            if ((viewDay.year % 4 === 0 && viewDay.year % 100 !== 0) || 
                viewDay.year % 400 === 0){ //윤년이면
                //윤년
                dateCountArr[1] = 29;
            } else { //윤년이 아니면
                //평년
                dateCountArr[1] = 28;
            }
        })();

        (function setMaxDate () {
            viewDay.maxdate = dateCountArr[viewDay.month-1];
        })();

        //요일계산
        var leapCount = parseInt((viewDay.year - 1) / 4) - parseInt((viewDay.year - 1) / 100) + parseInt((viewDay.year - 1) / 400); //작년까지 윤년의 개수를 셈
        var firstDay = (viewDay.year + leapCount) % 7; //1월1일의 요일
        var sumDate = 0;
        for (var i = 0; i < (viewDay.month - 1); i++){
            sumDate += dateCountArr[i];
        }
        var firstMonthDay = (firstDay + sumDate) % 7; //viewMonth 1일의 요일

        //달력 출력
        var handleClickCell = function () {
            selectDay(this, calendar);
        };

        var dateCount = 1;
        for (var i = 0; i < 6; i++){
            for (var j = 0; j < 7; j++){
                if ((i === 0 && j < firstMonthDay) || 
                    dateCount > dateCountArr[viewDay.month-1]){
                    tdArr[i][j].textContent = '';
                    tdArr[i][j].removeAttribute('class');
                    tdArr[i][j].removeEventListener('click', handleClickCell);
                    tdArr[i][j].classList.remove('selected');
                } else {
                    tdArr[i][j].textContent = dateCount;
                    tdArr[i][j].setAttribute('class', `date_${dateCount}`);
                    tdArr[i][j].addEventListener('click', handleClickCell);
                    tdArr[i][j].style.cursor = 'pointer';
                    if (dateCount === selectedDay.date && viewDay.month === selectedDay.month && viewDay.year === selectedDay.year){
                        tdArr[i][j].classList.add('selected');
                    } else {
                        tdArr[i][j].classList.remove('selected');
                    }
                    dateCount++;
                }
            }
        }
    };

    var run = function (parent, isTodayBtn, size, callback) {
        // 달력생성
        var calendar = {
            parent, //달력이 위치할 부모노드
            viewDay: {}, //달력에 보여지는 날짜
            selectedDay: {}, //사용자가 클릭한 날짜
            tdArr: [], //달력테이블셀
            isTodayBtn, //오늘버튼 생성여부
            size, //달력사이즈
        }

        //뷰 날짜 초기화
        initialize(calendar.viewDay);
        initialize(calendar.selectedDay);

        creater(calendar);

        setTimeout(function () {
            if (callback) callback();
        }, 0);

        return calendar; //변수에 할당해서 calendar 겍체에 접근할 수 있게 해줌.
    }

    var create = function (parent, isTodayBtn=false, callback) {
        return run(parent, isTodayBtn, 'big', callback);
    }

    var createMini = function (parent, isTodayBtn=false, callback) {
        return run(parent, isTodayBtn, 'mini', callback);
    }

    var recreate = function (calendar) {
        creater(calendar);
    }

    return {
        create, createMini
    };
})();