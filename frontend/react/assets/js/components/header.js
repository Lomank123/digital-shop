import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import history from '../history';
import { loginRoute, logoutRoute, signupRoute } from '../routeNames';



export default function Header() {

  const button1 = (
    <Box
      sx={{ display: 'inline', }}
      className="box1" 
      id="box1">
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        1
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        6
      </Button>

      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        2
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        3
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        4
      </Button>
    </Box>
  )


  return (
    <React.Fragment>
      {button1}
      <p>This is the header!</p>
    </React.Fragment>
  );
} 
