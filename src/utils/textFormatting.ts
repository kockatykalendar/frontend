import { Event } from "./types"
import { schoolTypeTexts } from "../constants"

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
  // TODO: consider using date-fns to format dates.

  let datesForHuman = ""
  if (event.date.text) {
    datesForHuman = event.date.text
  } else {
    let date = new Date(event.date.start)
    datesForHuman = date.getDate() + ". " + (date.getMonth() + 1) + "."

    if (event.date.end) {
      date = new Date(event.date.end)
      datesForHuman +=
        " – " + date.getDate() + ". " + (date.getMonth() + 1) + "."
    }
  }
  return datesForHuman
}
