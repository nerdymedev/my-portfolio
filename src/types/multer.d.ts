declare module 'multer' {
  interface File {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    destination: string
    filename: string
    path: string
    buffer: Buffer
  }

  interface Options {
    dest?: string
    storage?: any
    limits?: {
      fieldNameSize?: number
      fieldSize?: number
      fields?: number
      fileSize?: number
      files?: number
      parts?: number
      headerPairs?: number
    }
    preservePath?: boolean
    fileFilter?: (req: any, file: File, cb: (error: Error | null, acceptFile: boolean) => void) => void
  }

  function multer(options?: Options): any
  export = multer
}