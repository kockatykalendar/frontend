// automatically converted using https://bcherny.github.io/json-schema-to-typescript-browser/

export interface Event {
  id: string
  /**
   * Name of the event
   */
  name: string
  /**
   * Event sciences
   */
  sciences: [
    "mat" | "fyz" | "inf" | "other",
    ...("mat" | "fyz" | "inf" | "other")[]
  ]
  /**
   * Event type
   */
  type:
    | "sutaz"
    | "seminar"
    | "sustredenie"
    | "vikendovka"
    | "tabor"
    | "olympiada"
    | "prednasky"
  /**
   * Date information
   */
  date: {
    /**
     * Event date or start date if more days
     */
    start: string
    /**
     * End date
     */
    end?: string
    /**
     * Event date for user
     */
    text?: string
    [k: string]: unknown
  }
  /**
   * Organizer or list of organizers
   */
  organizers: string[]
  /**
   * Link to more information
   */
  link?: string
  /**
   * Place where the event is organized
   */
  places: string[]
  /**
   * Contestant information
   */
  contestants: {
    /**
     * Min class to attend
     */
    min: string
    /**
     * Max class to attend
     */
    max?: string
    [k: string]: unknown
  }
  /**
   * Notification settings
   */
  notifications?: {
    /**
     * How many days before should we notify people
     */
    remind_days_before: number[]
    [k: string]: unknown
  }
  [k: string]: unknown
}
