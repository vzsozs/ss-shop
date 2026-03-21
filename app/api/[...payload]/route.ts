import { 
  REST_DELETE, 
  REST_GET, 
  REST_OPTIONS, 
  REST_PATCH, 
  REST_POST, 
  REST_PUT 
} from '@payloadcms/next/routes'
import config from '../../../payload.config'

export const GET = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_GET(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}

export const POST = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_POST(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_DELETE(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}

export const PATCH = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_PATCH(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}

export const PUT = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_PUT(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}

export const OPTIONS = async (req: Request, { params }: { params: Promise<{ payload: string[] }> }) => {
  return REST_OPTIONS(config)(req, { 
    params: params.then((p) => ({
      slug: p.payload
    }))
  })
}
