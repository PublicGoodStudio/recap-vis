'use strict';

const daysInYear = 365;

const monthToDays = {
    '1': 31,
    '2': 28,
    '3': 31,
    '4': 30,
    '5': 31,
    '6': 30,
    '7': 31,
    '8': 31,
    '9': 30,
    '10': 31,
    '11': 30,
    '12': 31,
};

const monthNames = [
    {name: 'Jan', number: 1},
    {name: 'Feb', number: 2},
    {name: 'Mar', number: 3},
    {name: 'Apr', number: 4},
    {name: 'May', number: 5},
    {name: 'Jun', number: 6},
    {name: 'Jul', number: 7},
    {name: 'Aug', number: 8},
    {name: 'Sep', number: 9},
    {name: 'Oct', number: 10},
    {name: 'Nov', number: 11},
    {name: 'Dec', number: 12}
];

function dayOfYear( day, month, year, currentMonth=1 ) {

    if (currentMonth === month ) {

        return day;

    } else {

        return monthToDays[ currentMonth ] + dayOfYear(day, month, year, currentMonth + 1);

    }

}

export { daysInYear, dayOfYear, monthNames };
