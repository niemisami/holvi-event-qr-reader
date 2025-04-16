import './App.css';
import { EventManager } from './EventManager/EventManager';
import useLocalStorage from './hooks/useLocalStorage';
import SetupForm from './SetupForm/SetupForm';

const defaultManagerData = { spreadsheetId: '', range: '' }

export const Authorized = () => {
  const [persistedManagerData, setPersistedManagerData] = useLocalStorage('managerData', defaultManagerData);

  return (
    <div id='app'>
      {persistedManagerData?.spreadsheetId && persistedManagerData.range
        ? (
          <>
            <div className='reset-sheet-button'>
              <button onClick={() => { setPersistedManagerData(defaultManagerData) }}>
                <small>🔄 Reset spreadsheet</small>
              </button>
            </div>
            <EventManager
              spreadsheetId={persistedManagerData.spreadsheetId}
              range={persistedManagerData.range}
            />
          </>
        )
        : (
          <>
            <SetupForm
              onSubmit={data => {
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
