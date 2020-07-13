import React, { ChangeEvent, useEffect } from 'react'

import {
    OutlinedInput,
    InputLabel,
    InputAdornment,
    FormControl,
    Paper,
    Container,
    Grid,
    Select,
    Link,
    IconButton,
    makeStyles,
} from '@material-ui/core'
import clsx from 'clsx'

import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople'
import GitHubIcon from '@material-ui/icons/GitHub'
import Typography from '@material-ui/core/Typography'
import { Breakdown } from './Breakdown'
import { periodToYear, unitToYear } from './calcs'
import AboutDialog from './About'

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2em 3em',
        marginTop: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(0.5),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        maxWidth: 150,
    },
    heading: {},
    panel: {},
    topControls: {
        float: 'right',
        display: 'inline-flex',
    },
}))

function TopControls() {
    const classes = useStyles()
    return (
        <div className={classes.topControls}>
            <AboutDialog />
            <IconButton href="https://github.com/oselz/isitworththecost">
                <GitHubIcon fontSize="large" />
            </IconButton>
        </div>
    )
}

function App() {
    const classes = useStyles()

    const [values, setValues] = React.useState({
        timeCost: { value: 25, unit: 'dollars', period: 'hour' },
        serviceCost: { value: 125, unit: 'dollars', period: 'month' },
        trainingTime: { value: 2, unit: 'hour', period: null },
        timeSavings: { value: 60, unit: 'min', period: 'day' },
        peopleCount: { value: 1, unit: null, period: null },

        savingPeriodCost: 'year',
        savingPeriodPeople: 'day',
        paybackPeriod: 'day',
    })

    const [costs, setCosts] = React.useState({
        employeePerYear: 0,
        servicePerYear: 0,
        trainingPerYear: 0,
        savingsPerYear: 0,
        freeTimePerYear: 0,
        paybackTimePerYear: 0,
    })

    const handleChange = (prop: string, key: string | null = null) => (
        event: ChangeEvent<HTMLInputElement | { value: unknown }>,
    ): void => {
        let val: any = event.target.value
        if (key === null) {
            setValues({
                ...values,
                [prop]: val,
            })
        } else {
            if (key === 'value' && (val < 0 || isNaN(val))) {
                val = 0
            }
            setValues({
                ...values,
                [prop]: {
                    //@ts-ignore
                    value: values[prop].value,
                    //@ts-ignore
                    unit: values[prop].unit,
                    //@ts-ignore
                    period: values[prop].period,
                    //@ts-ignore
                    [key]: val,
                },
            })
        }
    }

    useEffect(() => {
        // save this to state for now for ease of visibility
        const employeePerYear =
            values.timeCost.value * periodToYear(values.timeCost.period, 1)
        const servicePerYear =
            values.serviceCost.value *
            periodToYear(values.serviceCost.period, 1)

        // assumes amortisation period of 1 year
        const trainingPerYear =
            unitToYear(values.trainingTime.unit, values.trainingTime.value) *
            employeePerYear *
            values.peopleCount.value

        const freeTimePerYear =
            periodToYear(
                values.timeSavings.period,
                unitToYear(values.timeSavings.unit, values.timeSavings.value),
            ) * values.peopleCount.value

        const savingsPerYear =
            employeePerYear * freeTimePerYear - servicePerYear - trainingPerYear

        const paybackTimePerYear =
            (trainingPerYear + servicePerYear) / employeePerYear

        setCosts({
            employeePerYear,
            servicePerYear,
            trainingPerYear,
            savingsPerYear,
            freeTimePerYear,
            paybackTimePerYear,
        })
    }, [values])

    return (
        <Container maxWidth={'md'}>
            <Paper className={classes.root} variant={'outlined'}>
                <div className={classes.heading}>
                    <TopControls />
                    <Typography variant="h2" component="h1">
                        Is it worth the cost?
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom>
                        A simple check on whether purchasing a service is worth
                        the cost.
                    </Typography>
                </div>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <h2>Basics</h2>
                        <p>1. Cost of your time or an employees time.</p>
                        <FormControl
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="time-cost">
                                Time Cost
                            </InputLabel>
                            <OutlinedInput
                                id="time-cost"
                                value={values.timeCost.value}
                                type="number"
                                onChange={handleChange('timeCost', 'value')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                }
                                labelWidth={80}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            className={classes.margin}
                        >
                            <InputLabel htmlFor="time-cost-unit">
                                per
                            </InputLabel>
                            <Select
                                native
                                value={values.timeCost.period}
                                onChange={handleChange('timeCost', 'period')}
                                labelWidth={40}
                                inputProps={{
                                    name: 'per',
                                    id: 'time-cost-unit',
                                }}
                            >
                                <option value={'hour'}>hour</option>
                                <option value={'day'}>day</option>
                                <option value={'week'}>week</option>
                                <option value={'month'}>month</option>
                                <option value={'year'}>year</option>
                            </Select>
                        </FormControl>
                        <p>2. Cost of the service under consideration.</p>
                        <FormControl
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="service-cost">
                                Service Cost
                            </InputLabel>
                            <OutlinedInput
                                id="service-cost"
                                value={values.serviceCost.value}
                                type="number"
                                onChange={handleChange('serviceCost', 'value')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                }
                                labelWidth={95}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            className={classes.margin}
                        >
                            <InputLabel htmlFor="service-cost-period">
                                per
                            </InputLabel>
                            <Select
                                native
                                value={values.serviceCost.period}
                                onChange={handleChange('serviceCost', 'period')}
                                labelWidth={40}
                                inputProps={{
                                    name: 'per',
                                    id: 'service-cost-period',
                                }}
                            >
                                {/*<option value={'hour'}>hour</option>*/}
                                <option value={'day'}>day</option>
                                <option value={'week'}>week</option>
                                <option value={'month'}>month</option>
                                <option value={'year'}>year</option>
                            </Select>
                        </FormControl>
                        <p>
                            3. Estimate the training time required (one person).
                        </p>
                        <FormControl
                            fullWidth
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="training-time">
                                Training Time
                            </InputLabel>
                            <OutlinedInput
                                id="training-time"
                                value={values.trainingTime.value}
                                type="number"
                                onChange={handleChange('trainingTime', 'value')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccessTimeIcon />
                                    </InputAdornment>
                                }
                                labelWidth={105}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            className={classes.margin}
                        >
                            <Select
                                native
                                value={values.trainingTime.unit}
                                onChange={handleChange('trainingTime', 'unit')}
                                inputProps={{
                                    name: 'per',
                                    id: 'training-time-unit',
                                }}
                            >
                                <option value={'hour'}>hours</option>
                                <option value={'day'}>days</option>
                                <option value={'week'}>weeks</option>
                                <option value={'month'}>months</option>
                                {/*<option value={'year'}>years</option>*/}
                            </Select>
                        </FormControl>
                        <p>
                            4. Estimate the time this service will save (one
                            person).
                        </p>
                        <FormControl
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="time-savings">
                                Time Saved
                            </InputLabel>
                            <OutlinedInput
                                id="time-savings"
                                type="number"
                                value={values.timeSavings.value}
                                onChange={handleChange('timeSavings', 'value')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccessTimeIcon />
                                    </InputAdornment>
                                }
                                labelWidth={80}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            className={classes.margin}
                        >
                            <Select
                                native
                                value={values.timeSavings.unit}
                                onChange={handleChange('timeSavings', 'unit')}
                            >
                                <option value={'minute'}>minutes</option>
                                <option value={'hour'}>hours</option>
                                <option value={'day'}>days</option>
                                <option value={'week'}>weeks</option>
                                <option value={'month'}>months</option>
                            </Select>
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            className={classes.margin}
                        >
                            <InputLabel htmlFor="time-savings-period">
                                per
                            </InputLabel>
                            <Select
                                id={'time-savings-period'}
                                native
                                value={values.timeSavings.period}
                                onChange={handleChange('timeSavings', 'period')}
                                labelWidth={40}
                            >
                                <option value={'hour'}>hour</option>
                                <option value={'day'}>day</option>
                                <option value={'week'}>week</option>
                                <option value={'month'}>month</option>
                                <option value={'year'}>year</option>
                            </Select>
                        </FormControl>
                        <p>5. Number of people using the service.</p>
                        <FormControl
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="people-count">
                                People
                            </InputLabel>
                            <OutlinedInput
                                id="people-count"
                                type="number"
                                value={values.peopleCount.value}
                                onChange={handleChange('peopleCount', 'value')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <EmojiPeopleIcon />
                                    </InputAdornment>
                                }
                                labelWidth={50}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Breakdown
                            values={values}
                            costs={costs}
                            handleChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}
export default App
