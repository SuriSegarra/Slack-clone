//to visitually sho ur user how much of the file that they have chosen has been uploaded 
import React from 'react';
import { Progress } from 'semantic-ui-react';


const ProgressBar = ({ uploadState, percentUploaded }) => (
    // as long the images being uploaded will show the progress once its done it will go away
    uploadState === 'uploading' && (
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
