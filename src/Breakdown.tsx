import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MoneyOffIcon from '@material-ui/icons/MoneyOff'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import Select from '@material-ui/core/Select'
import AlarmOnIcon from '@material-ui/icons/AlarmOn'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import { makeStyles } from '@material-ui/core/styles'
import { format, previousUnit, yearToPeriod, yearToUnit } from './calcs'

const useStyles = makeStyles(theme => ({
    secondaryText: {
        // fontSize: '0.875rem',
        color: 'rgba(0,0,0,0.6)',
    },
}))

function BreakdownItem({
    value,
    onChange,
    id,
    primary,
    secondary,
    tertiary,
    icon,
    error,
}: any) {
    const classes = useStyles()
    return (
        <ListItem alignItems="flex-start">
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
                disableTypography
                primary={
                    <Typography
                        variant="h5"
                        component="h3"
                        color={error ? 'secondary' : 'inherit'}
                    >
                        {primary}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <span className={classes.secondaryText}>
                            {secondary}{' '}
                        </span>
                        <Select
                            id={id}
                            value={value}
                            onChange={onChange}
                            native
                            className={classes.secondaryText}
                        >
                            <option value={'hour'}>hour</option>
                            <option value={'day'}>day</option>
                            <option value={'week'}>week</option>
                            <option value={'month'}>month</option>
                            <option value={'year'}>year</option>
                        </Select>
                        <span className={classes.secondaryText}>
                            {tertiary}
                        </span>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

interface BreakdownProps {
    values: any
    costs: any
    handleChange: (prop: string) => any
}

export function Breakdown(props: BreakdownProps) {
    const { values, costs, handleChange } = props
    const costError = costs.savingsPerYear <= 0
    return (
        <React.Fragment>
            <h2>Breakdown</h2>
            <p>By using this service you will:</p>
            <List>
                <Divider component="li" />
                <BreakdownItem
                    primary={`${costError ? 'Burn' : 'Save'} $${Math.abs(
                        Math.floor(
                            yearToPeriod(
                                values.savingPeriodCost,
                                costs.savingsPerYear,
                            ),
                        ),
                    )} ${costError ? ' extra' : ''}`}
                    secondary={'in employee time per'}
                    tertiary={''}
                    onChange={handleChange('savingPeriodCost')}
                    id="saving-period-cost"
                    value={values.savingPeriodCost}
                    icon={<MoneyOffIcon fontSize="large" />}
                    error={costError}
                />
                <Divider component="li" />
                <BreakdownItem
                    primary={`Free up ${format(
                        yearToUnit(
                            previousUnit(values.savingPeriodPeople),
                            yearToPeriod(
                                values.savingPeriodPeople,
                                costs.freeTimePerYear,
                            ),
                        ),
                        previousUnit(values.savingPeriodPeople),
                    )}`}
                    secondary={'of time per'}
                    tertiary={'across all your people'}
                    id="saving-period-people"
                    value={values.savingPeriodPeople}
                    onChange={handleChange('savingPeriodPeople')}
                    icon={<AlarmOnIcon fontSize="large" />}
                    error={costs.freeTimePerYear < 0}
                />
                <Divider component="li" />
                <BreakdownItem
                    primary={`Cover costs with ${format(
                        yearToUnit(
                            previousUnit(values.paybackPeriod),
                            yearToPeriod(
                                values.paybackPeriod,
                                costs.paybackTimePerYear,
                            ),
                        ),
                        previousUnit(values.paybackPeriod),
                    )}`}
                    secondary={'of use each'}
                    tertiary={'per person'}
                    id="saving-period-people"
                    value={values.paybackPeriod}
                    onChange={handleChange('paybackPeriod')}
                    icon={<CreditCardIcon fontSize="large" />}
                    error={costs.paybackTimePerYear < 0}
                />
                <Divider component="li" />
            </List>
        </React.Fragment>
    )
}
