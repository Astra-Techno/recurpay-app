/**
 * Check if a value is empty
 * @param {*} value - Input value to check
 * @returns {boolean} True if the value is considered empty
 */
export const isEmpty = (value) =>
{
    if (value == null) return true;
    if (typeof value === 'boolean') return false;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (value instanceof Date) return false;
    if (typeof value === 'object') {
      if (value.constructor === Object) return Object.keys(value).length === 0;
      if (value.constructor === Map || value.constructor === Set) return value.size === 0;
    }
    return false;
};

export function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

export function upper(str) {
  return str ? str.toUpperCase() : '';
}

export function lower(str) {
  return str ? str.toLowerCase() : '';
}

export const currency = (value, currency = 'USD', locale = 'en-US') => {
    if (isEmpty(value)) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
        .formatToParts(0)
        .find(part => part.type === 'currency').value;
    }
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value)
}

  /**
   * Format a date object
   * @param {Date|string} date - Date to format
   * @param {string} [format='YYYY-MM-DD'] - Format string
   * @returns {string} Formatted date or empty string for invalid dates
   */
  export const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = typeof date === 'object' ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const milliseconds = String(d.getMilliseconds()).padStart(3, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthShort = monthNames[d.getMonth()];
    return format
      .replace('A', ampm)
      .replace('YYYY', year)
      .replace('MMM', monthShort)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('SSS', milliseconds);
  };
  /**
   * Add months to a date
   * @param {Date|string} date - Start date
   * @param {number} months - Number of months to add
   * @returns {Date} New date object
   * @throws {Error} If input date is invalid
   */
  export const addMonths = (date, months, format = 'DD/MM/YYYY') =>
  {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error('Invalid date');
    const newDate = new Date(d);
    newDate.setMonth(d.getMonth() + months);
    // Handle edge case where original date was last day of month
    if (d.getDate() !== newDate.getDate()) {
      newDate.setDate(0);
    }
    return formatDate(newDate, format);
  };
  /**
   * Add days to a date
   * @param {Date|string} date - Start date
   * @param {number} days - Number of days to add
   * @returns {Date} New date object
   * @throws {Error} If input date is invalid
   */
  export const addDays = (date, days, format = 'DD/MM/YYYY') =>
  {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error('Invalid date');
    const newDate = new Date(d);
    newDate.setDate(d.getDate() + days);
    return formatDate(newDate, format);
  };
  /**
   * Compare two dates
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
   * @throws {Error} If either date is invalid
   */
  export const compareDate = (date1, date2) =>
  {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      throw new Error('Invalid date input');
    }
    const time1 = d1.getTime();
    const time2 = d2.getTime();
    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
  };
  export const getPerdayRent = (rent, period) =>
  {
    if (isEmpty(rent) || isEmpty(period))
      return 0;
    rent = parseFloat(rent);
    period	 = period.trim().toLowerCase();
    var periods = {'weekly' : 7, 'fortnightly' : 14, 'four weekly' : 28, 'monthly' : 365/12};
    if (period == '' ||typeof periods[period] == 'undefined')
      period = 'weekly';
    return rent / periods[period];
  }
  export const getWeeklyRent = (rent, period) =>
  {
    return getPerdayRent(rent, period);
  }