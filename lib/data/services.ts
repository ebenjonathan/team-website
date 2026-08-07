import { serviceAreas } from './masterBrief'

export const services = serviceAreas
export const featuredServices = services.filter((service) => service.id !== 'sales-marketing-crm')
