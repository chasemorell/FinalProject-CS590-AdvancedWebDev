import { cp } from "fs"

export const possibleIngredients = [
  "strawberry",
  "milk",
  "banana",
]

export interface DraftOrder {
  customerId: string
  ingredients: string[]
}

export interface Order extends DraftOrder {
  _id: string
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
}

export interface Customer {
  _id: string
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}

export interface Group {
  _id?: string
  name?: string
  creator?: string
  description?: string
  members?: string[]
  date?: string
  locked?: boolean
}

export interface ImageRecord{
  _id?: string
  groupId?: string
  creator?: string
  image?: any
}

export interface Comment{
  _id?: string
  message?: string
  creator: string
  groupId: string
  date?: string
}