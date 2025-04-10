
export type GoogleSheetConfig = {
  spreadsheetId: string
  tokenType: string
  accessToken: string
  range: string
  email: string
}

const requiredKeys: (keyof GoogleSheetConfig)[] = [
  'spreadsheetId',
  'tokenType',
  'accessToken',
  'range',
  'email'
] as const

export const isValidConfig = (config: Partial<GoogleSheetConfig> | null | undefined): config is GoogleSheetConfig =>
  config != null &&
  requiredKeys.every(key => config[key] != null && config[key] !== '')

export const missingConfigKeys = (config: Partial<GoogleSheetConfig> | null | undefined): string[] => {
  if(config == null) {
    return requiredKeys.map(key => key.toString())
  }
  return requiredKeys.filter(key => config[key] == null || config[key] === '')
}

/**
 *
 * @param config
 * @returns
 */
export const getSheetRows = async (config: GoogleSheetConfig) => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}`,
      {
        headers: {
          Authorization: `${config.tokenType} ${config.accessToken}`,
        }
      }
    )
    if(response.status !== 200) {
      const result = await response.json()
      throw new Error(`Error: ${response.status} ${response.statusText} ${result.error.message}`)
    }
    const result = await response.json()
    return (result.values || []) as string[][]
  } catch(error) {
    console.dir(error, { depth: null })
    throw error
  }
}


export type UpdateSheetResult = { updatedRows: number }
/**
 *
 * @param config
 * @param data array length must match the `config.range`
 * @returns
 */
export const updateSheet = async<TSheet>(config: GoogleSheetConfig, data: TSheet[]) => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        body: JSON.stringify({ values: [data] }),
        headers: {
          Authorization: `${config.tokenType} ${config.accessToken}`,
        }
      }
    )
    if(response.status !== 200) {
      const result = await response.json()
      throw new Error(`Error: ${response.status} ${response.statusText} ${result.error.message}`)
    }
    const result = await response.json()
    return { updatedRows: result.updatedRows } as UpdateSheetResult
  } catch(error) {
    console.dir(error, { depth: null })
    throw error
  }
}
