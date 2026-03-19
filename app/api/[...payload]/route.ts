import { 
  REST_DELETE, 
  REST_GET, 
  REST_OPTIONS, 
  REST_PATCH, 
  REST_POST, 
  REST_PUT 
} from '@payloadcms/next/routes'
import config from '../../../payload.config'

export const GET = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_GET(config)(req, { params: { slug: payload } })
}

export const POST = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_POST(config)(req, { params: { slug: payload } })
}

export const DELETE = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_DELETE(config)(req, { params: { slug: payload } })
}

export const PATCH = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_PATCH(config)(req, { params: { slug: payload } })
}

export const PUT = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_PUT(config)(req, { params: { slug: payload } })
}

export const OPTIONS = async (req: any, { params }: any) => {
  const { payload } = await params;
  return REST_OPTIONS(config)(req, { params: { slug: payload } })
}
