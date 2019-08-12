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

export default useDate;