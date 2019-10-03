/**
 * Takes a Timestamp or other Date and converts it into the Formate 'YYYY-MM-DD'
 * @param {String|Number} data a Timestamp or other form of Date
 * @return {String} String in Format 'YYYY-MM-DD'
 */
function useDate(data) {
    /**
     * helper to add a leading 0 to an Date
     * @param {Number} n 
     */
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }
    let currentDate = new Date(data);
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    return year + '-' + pad(month + 1) + "-" + pad(date);

}

/**
 * calls getStringDate and getStringClock
 * and builds one Date Format from it
 * @param {Number} timestamp
 * @param {String} loc holds information who calls this function
 * @return {String}
 */
export function getStringTime(timestamp, loc = '') {
    let out = getStringDate(timestamp, loc);
    let min = getStringClock(timestamp)
    out += ' ' + min;
    return out
}

/**
 * takes timestamp and extracts the date as an string
 * the form is Weekday 01.01
 * @param {Number} timestamp 
 * @return {String}
 */
export function getStringDate(timestamp, loc) {
    let date = new Date(timestamp);
    let out = '';
    const week = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    switch (loc) {
        case 'admin':
            out += week[date.getDay()] + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '.'
            break;
        default:
            out += week[date.getDay()];
            break;
    }
    return out;
}

/**
 * takes timestamp and extracts clocktime
 * returns it as a string
 * @param {Number} timestamp 
 * @return {String}
 */
export function getStringClock(timestamp) {
    let date = new Date(timestamp);
    let min = date.getMinutes();
    let hour = date.getHours();
    if (min < 10) {
        min = '0' + min;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    out = hour + ':' + min;
    return out
}

export default useDate;