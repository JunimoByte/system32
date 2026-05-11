(function () {
    "use strict";

    function initTabs() {
        var tabHeaders = document.querySelectorAll('#clock-tabs .tab-header');
        var tabBodies = document.querySelectorAll('.tab-body');

        tabHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                var target = header.dataset.tab;

                tabHeaders.forEach(function (h) { h.classList.remove('active'); });
                tabBodies.forEach(function (b) { b.classList.remove('active'); });

                header.classList.add('active');
                var activeBody = document.getElementById('tab-' + target);
                if (activeBody) activeBody.classList.add('active');
            });
        });
    }

    function initUptime() {
        var uptimeVal = document.getElementById('uptime-val');
        if (!uptimeVal) return;

        var startTime = Date.now();

        function updateUptime() {
            var diff = Date.now() - startTime;
            var secs = Math.floor(diff / 1000) % 60;
            var mins = Math.floor(diff / (1000 * 60)) % 60;
            var hrs = Math.floor(diff / (1000 * 60 * 60));

            uptimeVal.textContent =
                String(hrs).padStart(2, '0') + ":" +
                String(mins).padStart(2, '0') + ":" +
                String(secs).padStart(2, '0');
        }

        setInterval(updateUptime, 1000);
        updateUptime();
    }

    function initClock() {
        var hourHand = document.getElementById('hour-hand');
        var minHand = document.getElementById('minute-hand');
        var secHand = document.getElementById('second-hand');
        var digitalTime = document.getElementById('digital-time');
        var clockTicks = document.getElementById('clock-ticks');
        var tzName = document.getElementById('tz-name');
        var tzOption = document.getElementById('tz-option-current');

        if (clockTicks) {
            for (var i = 0; i < 60; i++) {
                var isMajor = i % 5 === 0;
                var angle = (i * 6) * (Math.PI / 180);
                var rInner = isMajor ? 38 : 42;
                var rOuter = 46;

                var x1 = 50 + rInner * Math.sin(angle);
                var y1 = 50 - rInner * Math.cos(angle);
                var x2 = 50 + rOuter * Math.sin(angle);
                var y2 = 50 - rOuter * Math.cos(angle);

                var tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
                tick.setAttribute("x1", x1);
                tick.setAttribute("y1", y1);
                tick.setAttribute("x2", x2);
                tick.setAttribute("y2", y2);
                tick.setAttribute("stroke", isMajor ? "#000" : "#808080");
                tick.setAttribute("stroke-width", isMajor ? "1.5" : "0.5");
                clockTicks.appendChild(tick);
            }
        }

        // Display Time Zone
        if (tzName || tzOption) {
            try {
                var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                var offset = new Date().getTimezoneOffset();
                var absOffset = Math.abs(offset);
                var offsetStr = (offset <= 0 ? '+' : '-') +
                    String(Math.floor(absOffset / 60)).padStart(2, '0') + ":" +
                    String(absOffset % 60).padStart(2, '0');

                var fullTzName = "(GMT" + offsetStr + ") " + tz.replace(/_/g, ' ');
                if (tzName) tzName.textContent = fullTzName;
                if (tzOption) tzOption.textContent = fullTzName;
            } catch (e) {
                if (tzName) tzName.textContent = "Local Time";
            }
        }

        function update() {
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds();
            var milliseconds = now.getMilliseconds();

            var hrAngle = (hours % 12) * 30 + minutes * 0.5;
            var minAngle = minutes * 6 + seconds * 0.1;
            var secAngle = seconds * 6 + milliseconds * 0.006;

            if (hourHand) hourHand.setAttribute('transform', 'rotate(' + hrAngle + ', 50, 50)');
            if (minHand) minHand.setAttribute('transform', 'rotate(' + minAngle + ', 50, 50)');
            if (secHand) secHand.setAttribute('transform', 'rotate(' + secAngle + ', 50, 50)');

            if (digitalTime) {
                var ampm = hours >= 12 ? 'PM' : 'AM';
                var dispHours = hours % 12;
                dispHours = dispHours ? dispHours : 12;
                digitalTime.textContent =
                    dispHours + ":" +
                    String(minutes).padStart(2, '0') + ":" +
                    String(seconds).padStart(2, '0') + " " + ampm;
            }

            requestAnimationFrame(update);
        }

        update();
    }

    function initCalendar() {
        var tableBody = document.getElementById('calendar-body');
        var monthSelect = document.getElementById('month-select');
        var yearInput = document.getElementById('year-input');

        if (!tableBody) return;

        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        var today = now.getDate();

        if (monthSelect) monthSelect.selectedIndex = currentMonth;
        if (yearInput) yearInput.value = currentYear;

        function renderMonth(month, year) {
            tableBody.innerHTML = '';
            var firstDay = new Date(year, month, 1).getDay();
            firstDay = (firstDay === 0) ? 6 : firstDay - 1;

            var daysInMonth = new Date(year, month + 1, 0).getDate();

            var date = 1;
            for (var i = 0; i < 6; i++) {
                var row = document.createElement('tr');
                for (var j = 0; j < 7; j++) {
                    var cell = document.createElement('td');
                    if (i === 0 && j < firstDay) {
                        cell.classList.add('empty');
                    } else if (date > daysInMonth) {
                        cell.classList.add('empty');
                    } else {
                        cell.textContent = date;
                        if (date === today && month === now.getMonth() && year === now.getFullYear()) {
                            cell.classList.add('today');
                        }
                        date++;
                    }
                    row.appendChild(cell);
                }
                tableBody.appendChild(row);
                if (date > daysInMonth) break;
            }
        }

        renderMonth(currentMonth, currentYear);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        initUptime();
        initClock();
        initCalendar();
    });
})();
