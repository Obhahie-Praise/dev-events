import mongoose, { CallbackError, Model, Schema, type HydratedDocument } from 'mongoose';

export interface Event {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventDocument = HydratedDocument<Event>;

const isNonEmptyString = (value: string): boolean => value.trim().length > 0;

const slugify = (title: string): string => {
  // URL-friendly slug: lowercase, trim, collapse whitespace, strip non-url chars.
  const base = title
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return base.replace(/^-|-$/g, '');
};

const normalizeDateToISO = (input: string): string => {
  // Normalize to ISO date (YYYY-MM-DD) for consistent storage/searching.
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date format. Expected a value parseable by Date.');
  }
  return parsed.toISOString().slice(0, 10);
};

const normalizeTimeToHHmm = (input: string): string => {
  // Normalize common time inputs into 24h HH:mm.
  const raw = input.trim();

  // 24-hour formats like 9:5, 09:05, 23:59
  const m24 = raw.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m24) {
    const h = Number(m24[1]);
    const m = Number(m24[2]);
    if (h < 0 || h > 23 || m < 0 || m > 59) throw new Error('Invalid time value.');
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // 12-hour formats like 9:00 PM, 09:00am
  const m12 = raw.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (m12) {
    let h = Number(m12[1]);
    const m = Number(m12[2]);
    const meridiem = m12[3].toLowerCase();

    if (h < 1 || h > 12 || m < 0 || m > 59) throw new Error('Invalid time value.');

    if (meridiem === 'pm' && h !== 12) h += 12;
    if (meridiem === 'am' && h === 12) h = 0;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  throw new Error('Invalid time format. Expected HH:mm or h:mm AM/PM.');
};

const nonEmptyStringValidator = {
  validator: (v: string): boolean => typeof v === 'string' && isNonEmptyString(v),
  message: 'Field must be a non-empty string.',
};

const nonEmptyStringArrayValidator = {
  validator: (v: string[]): boolean =>
    Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string' && s.trim().length > 0),
  message: 'Field must be a non-empty array of non-empty strings.',
};

const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    overview: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    image: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    venue: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    location: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    date: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    time: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    mode: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    audience: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    agenda: { type: [String], required: true, validate: nonEmptyStringArrayValidator },
    organizer: { type: String, required: true, trim: true, validate: nonEmptyStringValidator },
    tags: { type: [String], required: true, validate: nonEmptyStringArrayValidator },
  },
  {
    timestamps: true,
    strict: true,
  }
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre('save', function (this: EventDocument, next: (err?: CallbackError) => void) {
  try {
    // Required field validation beyond `required: true` (e.g., empty strings/arrays).
    if (!this.title || !isNonEmptyString(this.title)) throw new Error('Event title is required.');
    if (!this.description || !isNonEmptyString(this.description)) throw new Error('Event description is required.');
    if (!this.overview || !isNonEmptyString(this.overview)) throw new Error('Event overview is required.');
    if (!this.image || !isNonEmptyString(this.image)) throw new Error('Event image is required.');
    if (!this.venue || !isNonEmptyString(this.venue)) throw new Error('Event venue is required.');
    if (!this.location || !isNonEmptyString(this.location)) throw new Error('Event location is required.');
    if (!this.mode || !isNonEmptyString(this.mode)) throw new Error('Event mode is required.');
    if (!this.audience || !isNonEmptyString(this.audience)) throw new Error('Event audience is required.');
    if (!this.organizer || !isNonEmptyString(this.organizer)) throw new Error('Event organizer is required.');
    if (!Array.isArray(this.agenda) || this.agenda.length === 0) throw new Error('Event agenda is required.');
    if (!Array.isArray(this.tags) || this.tags.length === 0) throw new Error('Event tags are required.');

    // Slug is derived from title; only regenerate when title changes.
    if (this.isModified('title') || !this.slug) {
      const nextSlug = slugify(this.title);
      if (!nextSlug) throw new Error('Unable to generate slug from title.');
      this.slug = nextSlug;
    }

    // Normalize/validate date & time for consistent storage.
    this.date = normalizeDateToISO(this.date);
    this.time = normalizeTimeToHHmm(this.time);

    next();
  } catch (err: unknown) {
    next(err instanceof Error ? err : new Error('Event validation failed.'));
  }
});

export const Event: Model<Event> =
  (mongoose.models.Event as Model<Event> | undefined) ?? mongoose.model<Event>('Event', eventSchema);
