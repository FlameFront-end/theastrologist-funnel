export type Gender = 'female' | 'male'

export interface BirthDateValue {
  day: number | string
  month: string
  year: number | string
}

export interface BirthPlaceValue {
  name: string
  tz: string
  lat: number
  lon: number
}

export interface QuizAnswers {
  gender?: Gender
  step1?: string
  step2?: string
  relationship?: string
  patterns?: string
  birthDate?: BirthDateValue
  knowsBirthTime?: 'yes' | 'no'
  birthTime?: string
  birthPlace?: BirthPlaceValue
  photo?: File | null
  fullName?: string
  email?: string
  tier?: string
  [key: string]: unknown
}

export interface QuizState {
  step: number
  history: number[]
  answers: QuizAnswers
}

export type QuizPatch = Partial<QuizAnswers>

export type QuizDirection = 'forward' | 'back'
