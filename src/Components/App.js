import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import './App.css';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = () => (
  <Grid columns='equal' className='app' style={{ background: '#eee' }}>
    <ColorPanel />
    <SidePanel />

    <GridColumn style={{ marginLeft: 320 }}>
      <Messages />
    </GridColumn>

    <GridColumn width={4}>
      <MetaPanel />
    </GridColumn>
  </Grid>
);


export default App;
