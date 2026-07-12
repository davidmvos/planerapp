import { useEffect, useMemo, useState } from "react";
import "../css/Calendar.css";

function getLocalISODate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseISODate(isoDate) {
    const date = new Date(`${isoDate}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

function formatMonthLabel(date) {
    return new Intl.DateTimeFormat("de-DE", {
        month: "long",
        year: "numeric",
    }).format(date);
}

function formatDayLabel(date) {
    return new Intl.DateTimeFormat("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    }).format(date);
}

function getMonthDays(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekday = firstDay.getDay();
    const leadingEmptyDays = (firstWeekday + 6) % 7;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const cells = [];

    for (let index = 0; index < leadingEmptyDays; index += 1) {
        cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(date.getFullYear(), date.getMonth(), day));
    }

    return cells;
}

function getWeekdayIndex(isoDate) {
    const date = parseISODate(isoDate);

    if (!date) {
        return null;
    }

    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) {
        return null;
    }

    return weekday - 1;
}

function getSubjectName(subjects, subjectId) {
    if (!subjects) {
        return "";
    }

    return subjects[subjectId] || "Unbekanntes Fach";
}

export default function Calendar({
    value,
    onChange,
    label = "Datum auswählen",
    helperText = "Wähle ein Datum für die Aufgabe.",
    timetable = null,
    subjects = null,
    selectedSubject = -1,
    onSubjectChange = function(){}
}) {
    const selectedDate = value || getLocalISODate();
    const parsedSelectedDate = parseISODate(selectedDate) || new Date();
    const [displayMonth, setDisplayMonth] = useState(
        new Date(parsedSelectedDate.getFullYear(), parsedSelectedDate.getMonth(), 1)
    );

    useEffect(() => {
        const nextDate = parseISODate(selectedDate);
        if (nextDate) {
            setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
        }
    }, [selectedDate]);

    const monthCells = useMemo(() => getMonthDays(displayMonth), [displayMonth]);
    const weekdayIndex = getWeekdayIndex(selectedDate);
    const [activeSubject, setActiveSubject] = useState(selectedSubject);

    const subjSet = new Set(weekdayIndex !== null && timetable ? timetable[weekdayIndex] || [] : [])
    subjSet.delete(0);
    const daySubjects = Array.from(subjSet);

    function changeMonth(offset) {
        setDisplayMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    }

    function changeSubject(id) {
        setActiveSubject(id);
        onSubjectChange(id);
    }

    function handleSelectDate(date) {
        onChange(getLocalISODate(date));
    }

    function handleToday() {
        const today = new Date();
        onChange(getLocalISODate(today));
        setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }

    return (
        <>
        <label className="form-label" htmlFor="calendarDatePicker">
            {label}
        </label>
        <section className="calendar-shell card rounded-3" style={{borderColor: "rgb(222, 226, 230)"}}>
            <div className="card-body">
                {/*<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                    <div>
                        <h2 className="h5 mb-1">Kalender</h2>
                        <p className="text-secondary mb-0">{helperText}</p>
                    </div>
                    <div className="calendar-date-badge text-sm-end">
                        <div className="small text-secondary">Ausgewählt</div>
                        <div className="fw-semibold">{formatDayLabel(parsedSelectedDate)}</div>
                    </div>
                </div>*/}
                <input
                    type="date"
                    className="form-control mb-3"
                    id="calendarDatePicker"
                    value={selectedDate}
                    onChange={(event) => onChange(event.target.value)}
                />

                <div className="d-block d-sm-block d-xs-block d-lg-block d-xl-none">

                    <div className="calendar-month-header d-flex align-items-center justify-content-between gap-2 mb-3">
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => changeMonth(-1)}>
                            Zurück
                        </button>
                        <div className="text-center">
                            <div className="fw-semibold text-capitalize">{formatMonthLabel(displayMonth)}</div>
                            <div className="small text-secondary"></div>
                        </div>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => changeMonth(1)}>
                            Weiter
                        </button>
                    </div>

                    <div className="calendar-weekdays small text-secondary mb-2">
                        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((weekday) => (
                            <div key={weekday} className="calendar-weekday-cell">
                                {weekday}
                            </div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {monthCells.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="calendar-day-spacer" />;
                            }

                            const isoDate = getLocalISODate(date);
                            const isSelected = isoDate === selectedDate;
                            const isToday = isoDate === getLocalISODate();

                            return (
                                <div key={isoDate} className="calendar-day-cell-wrapper">
                                    <button
                                        type="button"
                                        className={`btn calendar-day-btn w-100 ${isSelected ? "btn-primary" : "btn-outline-primary"} ${isToday && !isSelected ? "calendar-day-today" : ""}`}
                                        onClick={() => handleSelectDate(date)}
                                    >
                                        <span className="d-block calendar-day-number">{date.getDate()}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button type="button" className="btn btn-link px-0 text-decoration-none" onClick={handleToday}>
                            Heute auswählen
                        </button>
                        <span className="text-secondary small">{formatDayLabel(parsedSelectedDate)}</span>
                    </div>

                </div>

                <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <h3 className="h6 mb-0">Fächer an diesem Tag</h3>
                        {/*<span className="badge text-bg-secondary">
                            {weekdayIndex === null ? "Kein Stundenplan" : ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"][weekdayIndex]}
                        </span>*/}
                    </div>

                    {weekdayIndex === null ? (
                        <div className="list-group">
                            <div className="list-group-item text-muted">
                                Keine
                            </div>
                        </div>
                    ) : (
                        <div className="list-group calendar-subject-list">
                            {Array.isArray(daySubjects) && daySubjects.length > 0 ? (
                                daySubjects.map((subjectId, index) => (
                                    <div
                                        key={`${selectedDate}-${index}`}
                                        className={`list-group-item ${subjectId === 0 ? "text-secondary" : ""} list-group-item-action ${subjectId === activeSubject ? "active" : "text-body"}`}
                                        style={{cursor: "pointer"}}
                                        onClick={function() {changeSubject(subjectId);}}
                                    >
                                        <span className="calendar-subject-name" data-subject-id={subjectId}>
                                            {subjectId === 0 ? "Frei" : getSubjectName(subjects, subjectId)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="list-group-item text-secondary">Keine Einträge vorhanden.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
        </>
    );
}
