import { useState } from 'react';
import './App.css'
import SetupForm from './SetupForm/SetupForm'
import { EventManager } from './EventManager/EventManager';
import useLocalStorage from './hooks/useLocalStorage';

export const Authorized = () => {
  const [managerData, setManagerData] = useState<{ spreadsheetId: string, range: string } | null>(null);

  const [persistedManagerData, setPersistedManagerData] = useLocalStorage('managerData', { spreadsheetId: '', range: '' });

  return (
    <div id='app'>
      <SetupForm
        onSubmit={data => {
          setManagerData(data)
          setPersistedManagerData(data)
        }}
        defaultValues={persistedManagerData}
      />
      {managerData
        ? (
          <EventManager
            spreadsheetId={managerData.spreadsheetId}
            range={managerData.range}
          />
        )
        : (
          <div>
            <h2>Welcome to the Event Manager</h2>
            <p>Please fill out the form to get started.</p>
          </div>
        )
      }
    </div>
  )
}
