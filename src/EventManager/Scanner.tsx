import React, { useCallback } from 'react'
import { BarcodeScanner, DetectedBarcode, useTorch } from 'react-barcode-scanner'
import './scanner.css'

type Props = {
  onScanned: (ticketId: string | null) => void
  isScanned: boolean
}

const Scanner = ({ onScanned, isScanned }: Props) => {
  const [isScannerOpen, setIsScannerOpen] = React.useState(false)

  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch()

  const onTorchSwitch = () => {
    setIsTorchOn(!isTorchOn)
  }

  const onCapture = useCallback((barcodes: DetectedBarcode[]) => {
    if(barcodes) {
      const barcode = barcodes[0]
      onScanned(barcode.rawValue)
    }
  }, [onScanned])

  return (
    <>
      <div>
        <button onClick={() => setIsScannerOpen(!isScannerOpen)}>
          {isScannerOpen ? 'Close Scanner' : 'Open Scanner'}
        </button>
        {isScanned
          ? <button onClick={() => onScanned(null)}>🔍 New scan</button>
          : null}
      </div>
      <div id='scanner'>
        {isScannerOpen
          ?
          <>
            <BarcodeScanner
              onCapture={onCapture}
            />
            {isTorchSupported
              ? <button onClick={onTorchSwitch}>🔦 Switch Torch</button>
              : null}
          </>
          : null}
      </div>

    </>
  )
}

export default Scanner
