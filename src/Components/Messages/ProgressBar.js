//to visitually sho ur user how much of the file that they have chosen has been uploaded 
import React from 'react';
import { Progress } from 'semantic-ui-react';


const ProgressBar = ({ uploadState, percentUploaded }) => (
    uploadState && (
        <Progress
            className='progress__bar'
            percent={percentUploaded}
            progress
            indicating
            size='medium'
            inverted
        />
    )
);

    export default ProgressBar;
