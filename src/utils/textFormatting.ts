import { Event } from "./types"
import { schoolTypeTexts } from "../constants"
import { format } from "date-fns"

function formatSchoolType(schoolType: string) {
  // @ts-ignore
  return schoolTypeTexts[schoolType]
}

export function formatContestants(event: Event) {
  // TODO: add tests

  const minSchoolType = event.contestants.min.substr(0, 2)
  const minSchoolYear = event.contestants.min.substr(2)

  if (event.contestants.max === undefined) {
    return `> ${formatSchoolType(minSchoolType)}${minSchoolYear}`
  }

  if (event.contestants.min == "zs1" && event.contestants.max == "zs9") {
    return "ZŠ"
  }
  if (event.contestants.min == "ss1" && event.contestants.max == "ss4") {
    return "SŠ"
  }

  const maxSchoolType = event.contestants.max.substr(0, 2)
  const maxSchoolYear = event.contestants.max.substr(2)

  if (minSchoolType === maxSchoolType) {
    return `${formatSchoolType(
      minSchoolType
    )} ${minSchoolYear} – ${maxSchoolYear}`
  }

  return `${formatSchoolType(
    minSchoolType
  )} ${minSchoolYear} – ${formatSchoolType(maxSchoolType)} ${maxSchoolYear}`
}

export function formatDates(event: Event) {
  // TODO: add tests

  if (event.date.text) {
    return event.date.text
  }

  if (event.date.end) {
    return `${format(new Date(event.date.start), "d. M.")} – ${format(
      new Date(event.date.end),
      "d. M."
    )}`
  }
  return format(new Date(event.date.start), "d. M.")
}
