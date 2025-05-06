import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const Alert=(props)=> {
    const toastTopCenter = useRef(null);
  

    const showMessage = (event, ref, severity) => {
        const label = event.target.innerText;

        ref.current.show({ severity: severity, summary: label, detail: label, life: 3000 });
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toastTopCenter} position="top-center" />
            <div className="flex flex-wrap gap-2">
                
                <Button label="Top Center" onClick={(e) => showMessage(e, toastTopCenter, 'info')} />
            
            </div>
        </div>
    )
}

export default Alert