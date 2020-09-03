import moment from "moment";

const parseDate = (date: string) => {
    let daysGrowing = "";
    const tempDate = new Date(date);
    const date_planted = moment(tempDate);
    const today = moment(new Date());

    const years = today.diff(date_planted, "year");
    date_planted.add(years, "years");

    const months = today.diff(date_planted, "months");
    date_planted.add(months, "months");

    const days = today.diff(date_planted, "days");

    if (years > 0) {
        if (years === 1) {
            daysGrowing += years + " year ";
        } else {
            daysGrowing += years + " years ";
        }
    }
    if (months > 0) {
        if (months === 1) {
            daysGrowing += months + " month ";
        } else {
            daysGrowing += months + " months ";
        }
    }
    if (days === 0 || days === 1) {
        daysGrowing += days + " day";
    } else {
        daysGrowing += days + " days";
    }
    return daysGrowing;
};

export default parseDate;