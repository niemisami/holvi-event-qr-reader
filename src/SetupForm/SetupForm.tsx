import { FormEvent, useState } from 'react';
import './setupForm.css';

type Props = {
  defaultValues: { spreadsheetId: string, range: string }
  onSubmit: (data: { spreadsheetId: string, range: string }) => void;
};

const SetupForm = ({ onSubmit, defaultValues }: Props) => {
  const [spreadsheetId, setSpreadsheetId] = useState(defaultValues.spreadsheetId);
  const [range, setRange] = useState(defaultValues.range);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!spreadsheetId || !range) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ spreadsheetId, range })
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="spreadsheetId">Spreadsheet ID</label>
        <input
          type="text"
          id="spreadsheetId"
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="range">Range</label>
        <input
          type="text"
          id="range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default SetupForm;
