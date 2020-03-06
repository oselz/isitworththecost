import moment from "moment";

const workingWeeksPerYear = 52

const workingMonthsPerYear = 12
const workingWeeksPerMonth = workingWeeksPerYear / workingMonthsPerYear
const workingDaysPerWeek = 5
const workingHoursPerDay = 8
const workingMinsPerHour = 60

const workingMinsPerDay = workingMinsPerHour * workingHoursPerDay
const workingMinsPerWeek = workingMinsPerDay * workingDaysPerWeek
const workingMinsPerMonth = workingMinsPerWeek * workingWeeksPerMonth
const workingMinsPerYear = workingMinsPerMonth * workingMonthsPerYear

export function unitToYear(period: string, value: number): number {
    switch (period) {
        case 'year':
            return value
        case 'month':
            return value / workingMonthsPerYear
        case 'week':
            return value / workingWeeksPerYear
        case 'day':
            return value / (workingDaysPerWeek * workingWeeksPerYear)
        case 'hour':
            return (
                value /
                (workingHoursPerDay * workingDaysPerWeek * workingWeeksPerYear)
            )
        case 'minute':
    }
    return (
        value /
        (workingMinsPerHour *
            workingHoursPerDay *
            workingDaysPerWeek *
            workingWeeksPerYear)
    )
}

export function yearToUnit(period: string, value: number): number {
    switch (period) {
        case 'year':
            return value
        case 'month':
            return value * workingMonthsPerYear
        case 'week':
            return value * workingWeeksPerYear
        case 'day':
            return value * (workingDaysPerWeek * workingWeeksPerYear)
        case 'hour':
            return (
                value *
                (workingHoursPerDay * workingDaysPerWeek * workingWeeksPerYear)
            )
        case 'minute':
    }
    return (
        value *
        (workingMinsPerHour *
            workingHoursPerDay *
            workingDaysPerWeek *
            workingWeeksPerYear)
    )
}

export function periodToYear(period: string, value: number): number {
    return yearToUnit(period, value)
}
export function yearToPeriod(period: string, value: number): number {
    return unitToYear(period, value)
}

export function previousUnit(unit: string): string {
    switch (unit) {
        case 'year':
            return 'month'
        case 'month':
            return 'hour'
        case 'week':
            return 'hour'
        case 'day':
            return 'hour'
        case 'hour':
            return 'minute'
        case 'minute':
    }
    return 'second'
}

export function format(value: number, format: string): string {
    if (
        (value < 8 && format === 'hour') ||
        (value < 480 && format === 'minute')
    ) {
        return moment.duration(value, format).humanize()
    }
    let val = Math.round(value).toString()
    let suffix = 's'

    if (value < 2) {
        val = value.toFixed(1)
    }
    if (val === '1.0') {
        val = 'one'
        suffix = ''
    }
    return `${val} ${format + suffix}`
}
