import React from 'react'
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles,
} from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    })

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string
    children: React.ReactNode
    onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    )
})

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent)

export default function AboutDialog() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <HelpOutlineIcon fontSize="large" />
            </IconButton>
            <Dialog
                onClose={handleClose}
                aria-labelledby="about-dialog-title"
                open={open}
            >
                <DialogTitle id="about-dialog-title" onClose={handleClose}>
                    Is it worth the cost? <br />A simple service provided for
                    free by Cardo.
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Queries can be directed to hey@isitworththecost.com.
                        <br />
                        <br />
                        Thanks to{' '}
                        <a href={'https://xkcd.com/1205/'}>
                            xkcd - Is It Worth the Time?
                        </a>{' '}
                        for inspiration.
                        <br />
                        <br />
                    </Typography>
                    <Typography gutterBottom>
                        Copyright 2020 Cardo Limited
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    )
}
