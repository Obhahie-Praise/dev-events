import mongoose, { Model, Schema, Types, type HydratedDocument } from 'mongoose';
import { Event } from './event.model';

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // common query filter: bookings by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string): boolean => typeof v === 'string' && EMAIL_RE.test(v),
        message: 'Invalid email format.',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre('save', async function (this: BookingDocument) {
  // Ensure we never persist a booking for a non-existent event.
  if (!Types.ObjectId.isValid(this.eventId)) {
    throw new Error('Invalid eventId.');
  }

  // Avoid an extra DB roundtrip if eventId was not changed.
  if (this.isNew || this.isModified('eventId')) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
      throw new Error('Referenced event does not exist.');
    }
  }
});

export const Booking: Model<Booking> =
  (mongoose.models.Booking as Model<Booking> | undefined) ??
  mongoose.model<Booking>('Booking', bookingSchema);
