import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Container, TextField, Button, Snackbar } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ContentCopyIcon from '@material-ui/icons/FileCopyOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://r.bhlnk.com'
  : 'http://localhost:8080';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '10%',
    textAlign: 'center',
  },
  row: {
    margin: 15,
  },
  close: {
    padding: theme.spacing(0.5),
  },
}));

function Input({ onSubmit }) {
  const [value, setValue] = useState('');
  const classes = useStyles();

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
    setValue('');
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12}>
        <TextField
          className="row input"
          type="text"
          value={value}
          onChange={handleChange}
          variant="outlined"
          margin="dense"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} className={classes.row}>
        <Button type="submit" variant="outlined">
          Submit
        </Button>
      </Grid>
    </form>
  );
}

function Redirect({ url, redirect, onCopy }) {
  const classes = useStyles();
  return (
    <CopyToClipboard text={redirect} onCopy={onCopy}>
      <Grid
        item
        xs={12}
        className={classes.row}
        container
        direction="row"
        justify="center"
      >
        <Grid item>
          <IconButton>
            <ContentCopyIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <a href={redirect}>{redirect}</a>{':'}
          <br />
          {`(${url})`}
        </Grid>
      </Grid>
    </CopyToClipboard>
  );
}

function SimpleSnackbar({ message, open, onClose }) {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          className={classes.close}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}

function App() {
  const [redirects, setRedirects] = useState({});
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const classes = useStyles();

  const handleSubmit = async url => {
    if (redirects[url]) return;
    try {
      const redirect = await axios.put(`${baseUrl}/`, { url }).then(({ data }) => data);
      setRedirects({
        ...redirects,
        [url]: redirect,
      });
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <Container maxWidth="sm" className={classes.container}>
      <Grid container direction="column">
        <Grid item xs={12} className={classes.row}>
          {"short urls for days"}
        </Grid>
        <Input onSubmit={handleSubmit} />
        <Grid item xs={12} container className={classes.row}>
          {Object.keys(redirects).map(url => (
            <Redirect
              key={url}
              url={url}
              redirect={redirects[url]}
              onCopy={() => setIsSnackbarOpen(true)}
            />
          ))}
        </Grid>
      </Grid>
      <SimpleSnackbar
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message="Link copied to clipboard"
      />
    </Container>
  );
}

export default App;
