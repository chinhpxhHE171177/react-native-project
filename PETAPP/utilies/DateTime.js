// yarn add moment
import moment from 'moment';
const convertDateTimeToString = (dateTime) => {
    return moment(dateTime).format('DD-MM-YYYY');
}

export default convertDateTimeToString;