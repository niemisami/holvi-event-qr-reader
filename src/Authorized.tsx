import { useState } from 'react';
import './App.css'
import SetupForm from './SetupForm/SetupForm'
import { EventManager } from './EventManager/EventManager';
import useLocalStorage from './hooks/useLocalStorage';

const defaultManagerData = { spreadsheetId: '', range: '' }

export const Authorized = () => {
  const [managerData, setManagerData] = useState<{ spreadsheetId: string, range: string } | null>(null);

  const [persistedManagerData, setPersistedManagerData] = useLocalStorage('managerData', defaultManagerData);

  return (
    <div id='app'>
      {managerData
        ? (
          <EventManager
            spreadsheetId={managerData.spreadsheetId}
            range={managerData.range}
          />
        )
        : (
          <>
            <SetupForm
              onSubmit={data => {
                setManagerData(data)
                setPersistedManagerData(data)
              }}
              defaultValues={persistedManagerData}
            />
            <div>
              <h2>Welcome to the Event Manager</h2>
              <p>Please fill out the form to get started.</p>
            </div>
          </>
        )
      }
    </div>
  )
}
