import { TargomoClient } from '@targomo/core'
import { environment } from '../environments/environment'

export const client = new TargomoClient('britishisles', environment.Targomo_API_KEY)

